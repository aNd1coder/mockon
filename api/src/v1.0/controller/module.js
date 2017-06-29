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
    let pk = await model.setRelation(false).getPk()
    let data = this.post()
    let user = this.userInfo()

    delete data[pk]

    if (!await this.memberOf(data.project_id)) {
      return this.fail('NOT_MEMBER')
    }

    if (think.isEmpty(data)) {
      return this.fail('data is empty')
    }

    data.user_id = user.id

    data.id = await model.add(data)

    if (data.id) {
      let project = await this.model('project').setRelation(false).db(model.db()).where({ id: data.project_id }).find()

      await this.createLogger({
        description: `创建了项目【${project.name}】接口分组【${data.name}】`,
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
    let module = await model.where({ [pk]: this.id }).find()
    let project = await this.model('project').setRelation(false).db(model.db()).where({ id: module.project_id }).find()

    if (!await this.ownerOf(project)) {
      return this.fail('NOT_OWNER')
    }

    let rows = await model.transaction(async () => {
      let apiModelInstance = self.model('api').setRelation(false).db(model.db())
      let responseModelInstance = self.model('response').setRelation(false).db(model.db())
      let paramModelInstance = self.model('param').setRelation(false).db(model.db())
      let fieldModelInstance = self.model('field').setRelation(false).db(model.db())
      let apis = await apiModelInstance.where({ module_id: self.id }).select()

      for (let api of apis) {
        await paramModelInstance.where({ api_id: api.id }).delete()
        await fieldModelInstance.where({ api_id: api.id }).delete()
        await responseModelInstance.where({ api_id: api.id }).delete()
        await apiModelInstance.where({ id: api.id }).delete()
      }

      return await model.where({ [pk]: self.id }).delete()
    })

    if (rows > 0) {
      await this.createLogger({
        description: `删除了项目【${project.name}】接口分组【${module.name}】`,
        project_id: module.project_id
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
    delete data.created_at
    delete data.modified_at

    if (think.isEmpty(data)) {
      return this.fail('data is empty')
    }

    let rows = await model.where({ [pk]: this.id }).update(data)

    if (rows) {
      let project = await this.model('project').setRelation(false).db(model.db()).where({ id: data.project_id }).find()

      await this.createLogger({
        description: `更新了项目【${project.name}】接口分组【${data.name}】信息`,
        project_id: data.project_id
      })
    }

    return this.success({ affectedRows: rows })
  }
}
