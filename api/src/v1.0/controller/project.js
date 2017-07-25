'use strict'

import Mockjs from 'mockjs'
import SwaggerParser from 'swagger-parser'
import Base from './base.js'

let fieldModelInstance
let project_id
let module_id
let api_id
let response_id
let user_id

export default class extends Base {
  async getAction() {
    let data
    let params = this.get()
    let action = params.action
    let user_id = params.user_id
    let user = this.userInfo()
    let where = {}

    delete params.action
    delete params.user_id

    if (this.id || 'find' === action) {
      if (this.id) {
        let pk = await this.modelInstance.getPk()
        where = { ...where, [pk]: this.id }
      } else {
        where = { ...where, ...params }
      }

      data = await this.modelInstance.where(where).find()
      return this.success(data)
    }

    if ('personal' === action) { // 个人项目
      where = { user_id: user_id, ...params }
    } else if ('team' === action) { // 团队项目
      let memberModelInstance = this.model('member')
      let projects = await memberModelInstance.where({ user_id: user_id, is_owner: 0 }).select()
      let ids = projects.map(item => {
        return item.project_id
      })

      if (ids.length > 0) {
        where.id = ['IN', ids]
        where = { ...where, ...params }
      } else {
        return this.success([])
      }
    } else if ('explore' === action) { // 浏览项目(非私有)
      where = { user_id: user.id, _logic: 'OR' }
    }

    // 不可查看别人私有项目
    if (user.id != user_id) {
      where.private = 0;
    }

    data = await this.modelInstance.where(where).order('modified_at DESC').select()

    return this.success(data)
  }

  async postAction() {
    let model = this.modelInstance
    let pk = await model.setRelation(false).getPk()
    let data = this.post()
    let user = this.userInfo()

    delete data[pk]

    if (think.isEmpty(data)) {
      return this.fail('data is empty')
    }

    let projects = await model.where({ code: data.code }).select()

    if (projects.length > 0) {
      return this.fail('项目代号已被占用')
    }

    data.user_id = user.id

    let id = await model.add(data)

    data.id = id

    // `项目创建者`即为`拥有者`
    await this.model('member').add({
      project_id: id,
      user_id: user.id,
      is_owner: 1
    })

    if (id) {
      await this.createLogger({ description: `初始化了项目【${data.name}】`, project_id: id })
    }

    return this.success(data)
  }

  async deleteAction() {
    let self = this
    let model = this.modelInstance
    let pk = await model.setRelation(false).getPk()

    if (!this.id) {
      return this.fail('params error')
    }

    if (!await this.ownerOf(this.id)) {
      return this.fail('NOT_OWNER')
    }

    let project = await model.where({ [pk]: this.id }).find()
    let rows = await model.transaction(async () => {
      // 删除成员
      await self.model('member').setRelation(false).db(model.db()).where({ project_id: self.id }).delete()

      // 删除字段
      await self.model('field').setRelation(false).db(model.db()).where({ project_id: self.id }).delete()

      // 删除参数
      await self.model('param').setRelation(false).db(model.db()).where({ project_id: self.id }).delete()

      // 删除状态码
      await self.model('error').setRelation(false).db(model.db()).where({ project_id: self.id }).delete()

      // 删除响应
      await self.model('response').setRelation(false).db(model.db()).where({ project_id: self.id }).delete()

      // 删除接口
      await self.model('api').setRelation(false).db(model.db()).where({ project_id: self.id }).delete()

      // 删除分组
      await self.model('module').setRelation(false).db(model.db()).where({ project_id: self.id }).delete()

      return await model.where({ [pk]: self.id }).delete()
    })

    if (rows > 0) {
      await this.createLogger({ description: `删除了项目【${project.name}】及关联数据` })
    }

    return this.success({ affectedRows: rows })
  }

  buildResponseBody(body, properties) {
    if (properties) {
      for (let name in properties) {
        let obj = properties[name]
        let defaultValue = obj.default || obj.example
        let description = obj.description || ''
        let type = obj.type || ''
        let format = obj.format || ''

        fieldModelInstance.add({
          name,
          description,
          project_id,
          api_id,
          response_id,
          user_id
        })

        if (type === 'integer') {
          body[name + '|1-100000'] = defaultValue || 1
        }

        if (type === 'boolean') {
          body[name] = defaultValue || '@boolean'
        }

        if (type === 'string') {
          if (obj.enum) {
            body[name + '|1'] = obj.enum
          } else if (format === 'date-time') {
            body[name] = defaultValue || '@date("yyyy-MM-dd") @time'
          } else {
            body[name] = defaultValue || '@title(1, 3)'
          }
        }

        if (type === 'object') {
          body[name] = {}

          this.buildResponseBody(body[name], obj.properties)
        }

        if (type === 'array') {
          body[name] = {}

          if (obj.items.properties) {
            this.buildResponseBody(body[name], obj.items.properties)
          } else {
            body[name] = `@${obj.items.type}`
          }

          body[name] = [body[name]]
        }
      }
    }
  }

  async putAction() {
    if (!this.id) {
      return this.fail('params error')
    }

    let model = this.modelInstance
    let pk = await model.setRelation(false).getPk()
    let data = this.post()
    let params = this.get()
    let action = params.action || ''

    if (!await this.ownerOf(data)) {
      return this.fail('NOT_OWNER')
    }

    delete data[pk]
    delete data.members
    delete data.owner
    delete data.created_at
    delete data.modified_at

    let project = await model.where({ [pk]: this.id }).find()

    if (data.code !== project.code) {
      let projects = await model.where({ code: data.code }).select()

      if (projects.length > 0) {
        return this.fail('项目代号已被占用')
      }
    }

    if (action === 'update-swagger') {
      let swaggerDocument
      let user = this.userInfo()

      project_id = this.id
      user_id = user.id

      let moduleModelInstance = this.model('module').setRelation(false).db(model.db())
      let apiModelInstance = this.model('api').setRelation(false).db(model.db())
      let responseModelInstance = this.model('response').setRelation(false).db(model.db())
      let errorModelInstance = this.model('error').setRelation(false).db(model.db())
      let paramModelInstance = this.model('param').setRelation(false).db(model.db())
      fieldModelInstance = this.model('field').setRelation(false).db(model.db())

      // 解析 swagger.json/swagger.yaml 文档
      try {
        swaggerDocument = await SwaggerParser.validate(project.swagger_url)
      } catch (e) {
        return this.fail('文档验证失败：' + e.message)
      }

      let info = swaggerDocument.info
      let schemes = swaggerDocument.schemes
      let paths = swaggerDocument.paths

      let _module = { "name": '默认分组', "code": 'default', project_id }
      let modules = await moduleModelInstance.where(_module).select()

      // 创建默认分组
      if (modules.length === 0) {
        module_id = await moduleModelInstance.add({ ..._module, user_id })
      } else {
        module_id = modules[0].id
      }

      data.description = info.description
      data.base_url = schemes[0] + '://' + swaggerDocument.host + swaggerDocument.basePath

      errorModelInstance.where({ project_id }).delete()
      paramModelInstance.where({ project_id }).delete()
      fieldModelInstance.where({ project_id }).delete()

      for (let path in paths) {
        let apis = paths[path]

        // 存在 url + method 则更新
        for (let method in apis) {
          let api = apis[method]
          let url = data.base_url + path
          method = method.toUpperCase()
          let _apis = await apiModelInstance.where({ project_id, module_id, method, url }).select()
          let _api = {
            name: api.summary,
            description: api.description,
            method,
            url,
            project_id,
            module_id,
            status: api.deprecated ? 2 : 1,
            developer: info.contact && info.contact.email,
            user_id
          }

          if (_apis.length === 0) {
            api_id = await apiModelInstance.add(_api)
          } else {
            api_id = _apis[0].id

            delete _api.created_at
            delete _api.modified_at

            await apiModelInstance.where({ id: api_id }).update(_api)
          }

          for (let statusCode in api.responses) {
            let response = api.responses[statusCode]
            let _responses
            let _response = {}
            let type = statusCode === '200' ? 'success' : 'error'
            let description = response.description
            let enctype = api.produces && api.produces.length > 0 && api.produces[0]
              || swaggerDocument.produces && swaggerDocument.produces.length > 0 && swaggerDocument.produces[0]
              || 'application/json'
            let schema = response.schema
            let body = {}

            // 处理响应结果
            if (schema) {
              let isArray = schema.type === 'array'
              let isObject = schema.type === 'object'

              if (isArray || isObject) {
                this.buildResponseBody(body, isArray ? schema.items.properties : schema.properties)
              } else {
                body = `@${schema.type}`
              }

              if (isArray) {
                body = [body]
              }
            } else {
              body = { code: statusCode, description: response.description }
            }

            // 处理响应数据
            _response = {
              type,
              description,
              enctype,
              body: JSON.stringify(Mockjs.mock(body)),
              project_id,
              api_id,
              user_id
            }

            _responses = await responseModelInstance.where({
              type,
              description,
              enctype,
              project_id,
              api_id
            }).select()

            if (_responses.length === 0) {
              // 新增时的默认模拟数据模版
              _response.template = statusCode == '200' ? JSON.stringify(body) : ''
              response_id = await responseModelInstance.add(_response)
            } else {
              response_id = _responses[0].id

              delete _response.created_at
              delete _response.modified_at

              await responseModelInstance.where({ id: response_id }).update(_response)
            }

            // 处理参数数据
            for (let param of api.parameters) {
              if (param.in === 'body') {
                let schema = param.schema
                let isObject = schema.type === 'object'
                let properties = isObject ? schema.properties : schema.items.properties
                for (let name in properties) {
                  let property = properties[name]
                  let type = property.type
                  let required = isObject ? schema.required : schema.items.required
                  let description = (property.description || '') + (property.enum ? '（' + property.enum.join('、') + '）' : '')

                  if (schema.type === 'object') {
                    required = required && required.indexOf(name) !== -1 ? 1 : 0
                  } else {
                    required = property.required
                  }

                  if (property.type === 'object') {
                    description += `${JSON.stringify(property.properties)}`
                  }

                  await paramModelInstance.add({
                    name,
                    type,
                    location: param.in,
                    default_value: property.example || '',
                    required,
                    description,
                    project_id,
                    api_id,
                    response_id,
                    user_id
                  })
                }
              } else {
                let description = param.description
                let default_value = ''

                if (param.type === 'array') {
                  if (param.items.type !== 'object') {
                    if (param.items.enum) {
                      description = description + '（' + param.items.enum.join('、') + '）'
                    }

                    if (param.items.default) {
                      default_value = param.items.default
                    }
                  }
                }

                await paramModelInstance.add({
                  name: param.name,
                  type: param.type,
                  location: param.in,
                  default_value,
                  required: param.required ? 1 : 0,
                  description,
                  project_id,
                  api_id,
                  response_id,
                  user_id
                })
              }
            }

            // 处理状态码数据
            errorModelInstance.add({
              code: statusCode,
              description: response.description,
              project_id,
              api_id,
              user_id
            })
          }
        }
      }
    }

    if (think.isEmpty(data)) {
      return this.fail('data is empty')
    }

    let rows = await model.where({ [pk]: this.id }).update(data)

    if (rows > 0) {
      await this.createLogger({ description: `更新了项目【${project.name}】信息`, project_id: this.id })
    }

    return this.success({ affectedRows: rows })
  }
}
