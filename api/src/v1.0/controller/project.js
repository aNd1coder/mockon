'use strict'

import superAgent from 'superagent'
import Base from './base.js'

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

  async deleteAction(self) {
    if (!this.id) {
      return this.fail('params error')
    }

    if (!await this.ownerOf(this.id)) {
      return this.fail('NOT_OWNER')
    }

    let model = this.modelInstance
    let pk = await model.setRelation(false).getPk()
    let rows = await model.transaction(async () => {
      // 删除成员
      await self.model('member').setRelation(false).db(model.db()).where({ project_id: self.id }).delete()

      // 删除字段
      await self.model('field').setRelation(false).db(model.db()).where({ project_id: self.id }).delete()

      // 删除参数
      await self.model('param').setRelation(false).db(model.db()).where({ project_id: self.id }).delete()

      // 删除响应
      await self.model('response').setRelation(false).db(model.db()).where({ project_id: self.id }).delete()

      // 删除接口
      await self.model('api').setRelation(false).db(model.db()).where({ project_id: self.id }).delete()

      // 删除分组
      await self.model('module').setRelation(false).db(model.db()).where({ project_id: self.id }).delete()

      return await model.where({ [pk]: self.id }).delete()
    })

    if (rows > 0) {
      await this.createLogger({ description: `删除了项目【${data.name}】及关联数据` })
    }

    return this.success({ affectedRows: rows })
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

    if (action === 'update-swagger') {
      let project = await model.where({ [pk]: this.id }).find()
      let project_id = this.id
      let user = this.userInfo()
      let user_id = user.id
      let result = await superAgent.get(project.swagger_url)
      let moduleModelInstance = this.model('module').setRelation(false).db(model.db())
      let apiModelInstance = this.model('api').setRelation(false).db(model.db())
      let responseModelInstance = this.model('response').setRelation(false).db(model.db())
      let paramModelInstance = this.model('param').setRelation(false).db(model.db())

      if (result.statusCode === 200) {
        project = result.body

        let info = project.info
        let schemes = project.schemes
        let paths = project.paths
        let definitions = project.definitions
        let module_id = await moduleModelInstance.add({
          name: '默认分组',
          code: 'default',
          project_id,
          user_id
        })

        data.name = info.name
        data.description = info.description
        data.base_url = schemes[0] + '://' + project.host + project.basePath

        for (let path in paths) {
          let apis = paths[path]

          for (let method in apis) {
            let api = apis[method]
            let api_id = await apiModelInstance.add({
              name: api.summary,
              description: api.description,
              method: method.toUpperCase(),
              url: data.base_url + path,
              project_id,
              module_id,
              user_id
            })

            for (let statusCode in api.responses) {
              let response = api.responses[statusCode]
              let response_id = await responseModelInstance.add({
                type: (statusCode == 200 ? 'success' : 'error'),
                description: response.description,
                enctype: api.produces[0] || 'application/json',
                body: '',
                project_id,
                api_id,
                user_id
              })

              for (let param of api.parameters) {
                if (param.schema) {
                  let ref = param.schema.$ref ? param.schema.$ref.replace('#/definitions/', '') : ''
                  let definition = definitions[ref] // "#/definitions/User"
                  let properties = definition && definition.properties ? definition.properties : {}

                  for (let name in properties) {
                    let property = properties[name]

                    if (property.$ref) {
                      property = definitions[property.$ref.replace('#/definitions/', '')]
                    }

                    let type = property.type
                    let required = property.required
                    let description = (property.description || '') + '[' + (property.enum ? property.enum.join(',') + ']' : '')

                    required = required && required.indexOf(name) !== -1 ? 1 : 0

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
                  await paramModelInstance.add({
                    name: param.name,
                    type: param.type,
                    location: param.in,
                    default_value: '',
                    required: param.required ? 1 : 0,
                    description: param.description,
                    project_id,
                    api_id,
                    response_id,
                    user_id
                  })
                }
              }
            }
          }
        }
      } else {
        return this.fail(result.statusMessage)
      }
    }

    if (think.isEmpty(data)) {
      return this.fail('data is empty')
    }

    let rows = await model.where({ [pk]: this.id }).update(data)

    if (rows > 0) {
      await this.createLogger({ description: `更新了项目【${data.name}】信息`, project_id: this.id })
    }

    return this.success({ affectedRows: rows })
  }
}
