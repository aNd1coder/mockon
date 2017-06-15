'use strict'

import Base from './base.js'

export default class extends Base {
  async getAction() {
    let data
    let params = this.get()
    let action = params.action
    let user = this.userInfo()
    let where = {}

    if (user) {
      where = { user_id: user.id }
    }

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
    let pk = await this.modelInstance.getPk()
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

    data.id = await this.modelInstance.add(data)

    if (data.id) {
      let projectModelInstance = this.model('project')
      let project = await projectModelInstance.where({ id: data.project_id }).find()

      await this.createLogger({
        description: `创建了项目【${project.name}】接口【${data.name}】`,
        project_id: data.project_id
      })
    }

    return this.success(data)
  }

  async deleteAction() {
    if (!this.id) {
      return this.fail('params error')
    }

    let pk = await this.modelInstance.getPk()
    let api = await this.modelInstance.where({ [pk]: this.id }).find()

    if (!await this.memberOf(api.project_id)) {
      return this.fail('NOT_MEMBER')
    }

    let rows = await this.modelInstance.where({ [pk]: this.id }).delete()

    if (rows > 0) {
      let projectModelInstance = this.model('project')
      let project = await projectModelInstance.where({ id: api.project_id }).find()

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

    let pk = await this.modelInstance.getPk()
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

    let rows = await this.modelInstance.where({ [pk]: this.id }).update(data)

    if (rows) {
      let projectModelInstance = this.model('project')
      let project = await projectModelInstance.where({ id: data.project_id }).find()

      await this.createLogger({
        description: `更新了项目【${project.name}】接口【${data.name}】信息`,
        project_id: data.project_id
      })
    }

    return this.success({ affectedRows: rows })
  }
}
