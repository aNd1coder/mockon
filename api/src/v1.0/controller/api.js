'use strict'

import Base from './base.js'

export default class extends Base {
  async getAction() {
    let data
    let params = this.get()
    let action = params.action
    let where = {}

    delete params.action

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

    where = { ...where, ...params }

    data = await this.modelInstance.where(where).select()

    return this.success(data)
  }

  async postAction() {
    let model = this.modelInstance
    let pk = await model.getPk()
    let data = this.post()
    let params = this.get()
    let action = params.action || ''
    let user = this.userInfo()
    let responses = data.response

    delete data[pk]
    delete data.project
    delete data.module
    delete data.response
    delete data.user
    delete data.created_at
    delete data.modified_at

    if (!await this.memberOf(data.project_id)) {
      return this.fail('NOT_MEMBER')
    }

    if (think.isEmpty(data)) {
      return this.fail('data is empty')
    }

    data.user_id = user.id
    data.id = await model.add(data)

    if ('duplicate' === action) {
      let responseModelInstance = this.model('response').setRelation(false).db(model.db())
      let paramModelInstance = this.model('param').setRelation(false).db(model.db())
      let fieldModelInstance = this.model('field').setRelation(false).db(model.db())

      for (let response of responses) {
        if (response.id) {
          let responseId = response.id
          let response_id
          let params = response.param

          delete response.id
          delete response.param
          delete response.created_at
          delete response.modified_at

          response.api_id = data.id
          response.user_id = user.id
          response_id = await responseModelInstance.add(response)

          for (let param of params) {
            if (param.id) {
              delete param.id
              delete param.created_at
              delete param.modified_at

              param.api_id = data.id
              param.response_id = response_id
              param.user_id = user.id

              await paramModelInstance.add(param)
            }
          }

          let fields = await fieldModelInstance.where({ api_id: data.id, response_id: responseId }).select()

          for (let field of fields) {
            if (field.id) {
              delete field.id
              delete field.created_at
              delete field.modified_at

              field.api_id = data.id
              field.response_id = response_id
              field.user_id = user.id

              await fieldModelInstance.add(field)
            }
          }
        }
      }
    }

    if (data.id) {
      let project = await this.model('project').setRelation(false).db(model.db()).where({ id: data.project_id }).find()

      await this.createLogger({
        description: `创建了项目【${project.name}】接口【${data.name}】`,
        project_id: data.project_id
      })
    }

    return this.success(data)
  }

  async deleteAction(self) {
    if (!this.id) {
      return this.fail('params error')
    }

    let model = this.modelInstance
    let pk = await model.setRelation(false).getPk()
    let api = await model.where({ [pk]: this.id }).find()

    if (!await this.memberOf(api.project_id)) {
      return this.fail('NOT_MEMBER')
    }

    let rows = await model.transaction(async () => {
      await self.model('param').setRelation(false).db(model.db()).where({ api_id: api.id }).delete()
      await self.model('field').setRelation(false).db(model.db()).where({ api_id: api.id }).delete()
      await self.model('response').setRelation(false).db(model.db()).where({ api_id: api.id }).delete()
      await self.model('error').setRelation(false).db(model.db()).where({ api_id: api.id }).delete()

      return await model.where({ [pk]: api.id }).delete()
    })

    if (rows > 0) {
      let project = await this.model('project').setRelation(false).db(model.db()).where({ id: api.project_id }).find()

      await this.createLogger({
        description: `删除了项目【${project.name}】接口【${api.name}】`,
        project_id: api.project_id
      })
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

    if (!await this.memberOf(data.project_id)) {
      return this.fail('NOT_MEMBER')
    }

    delete data[pk]
    delete data.user
    delete data.response
    delete data.created_at
    delete data.modified_at

    if (think.isEmpty(data)) {
      return this.fail('data is empty')
    }

    let rows = await model.where({ [pk]: this.id }).update(data)

    if (rows) {
      let project = await this.model('project').setRelation(false).db(model.db()).where({ id: data.project_id }).find()

      await this.createLogger({
        description: `更新了项目【${project.name}】接口【${data.name}】信息`,
        project_id: data.project_id
      })
    }

    return this.success({ affectedRows: rows })
  }
}
