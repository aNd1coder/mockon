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

    delete data[pk]

    let project = await this.model('project').setRelation(false).db(model.db()).where({ id: data.project_id }).find()

    if (!await this.ownerOf(project)) {
      return this.fail('NOT_OWNER')
    }

    if (think.isEmpty(data)) {
      return this.fail('data is empty')
    }

    data.id = await model.add(data)

    let user = await this.model('user').db(model.db()).where({ id: data.user_id }).find()

    data.user = user
    data.project = project

    if (data.id) {
      await this.createLogger({
        description: `邀请了【${user.username}】加入项目【${project.name}】`,
        project_id: project.id
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
    let member = await model.where({ [pk]: this.id }).find()
    let project = await this.model('project').setRelation(false).db(model.db()).where({ id: member.project_id }).find()

    if (!await this.ownerOf(project)) {
      return this.fail('NOT_OWNER')
    }

    let user = await this.model('user').db(model.db()).where({ id: member.user_id }).find()

    let rows = await model.where({ [pk]: this.id }).delete()

    if (rows > 0) {
      await this.createLogger({
        description: `移除了项目【${project.name}】成员【${user.username}】 `,
        project_id: project.id
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

    if (!await this.ownerOf(data.project_id)) {
      return this.fail('NOT_OWNER')
    }

    if (think.isEmpty(data)) {
      return this.fail('data is empty')
    }

    let rows = await model.where({ [pk]: this.id }).update(data)

    if (rows > 0) {
      let project = await this.model('project').setRelation(false).db(model.db()).where({ id: data.project_id }).find()
      let user = await this.model('user').db(model.db()).where({ id: data.user_id }).find()

      await this.createLogger({
        description: `更新了项目【${project.name}】成员【${user.username}】信息`,
        project_id: project.id
      })
    }

    return this.success({ affectedRows: rows })
  }
}
