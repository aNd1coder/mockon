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
      data.required = !!data.required
      return this.success(data)
    }

    where = { ...where, ...params }

    data = await this.modelInstance.where(where).select()

    data.map(param => {
      return param.required = !!param.required
    })

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
    data.required = data.required ? 1 : 0
    data.id = await model.add(data)

    if (data.id) {
      let project = await this.model('project').setRelation(false).db(model.db()).where({ id: data.project_id }).find()

      await this.createLogger({
        description: `添加了项目【${project.name}】参数【${data.name}】`,
        project_id: data.project_id
      })
    }

    return this.success(data)
  }

  async deleteAction() {
    if (!this.id) {
      return this.fail('params error')
    }

    let model = this.modelInstance
    let pk = await model.setRelation(false).getPk()
    let param = await model.where({ [pk]: this.id }).find()
    let rows = await model.where({ [pk]: this.id }).delete()

    if (rows > 0) {
      let project = await this.model('project').setRelation(false).db(model.db()).where({ id: param.project_id }).find()

      await this.createLogger({
        description: `删除了项目【${project.name}】参数【${param.name}】`,
        project_id: param.project_id
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

    delete data[pk]
    delete data.created_at
    delete data.modified_at

    if (!await this.memberOf(data.project_id)) {
      return this.fail('NOT_MEMBER')
    }

    if (think.isEmpty(data)) {
      return this.fail('data is empty')
    }

    data.required = data.required ? 1 : 0

    let rows = await model.where({ [pk]: this.id }).update(data)

    if (rows > 0) {
      let project = await this.model('project').setRelation(false).db(model.db()).where({ id: data.project_id }).find()

      await this.createLogger({
        description: `更新了项目【${project.name}】参数【${data.name}】信息`,
        project_id: data.project_id
      })
    }

    return this.success({ affectedRows: rows })
  }
}
