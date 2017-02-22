'use strict'

import Base from './base.js'

export default class extends Base {
  async getAction() {
    let data
    let params = this.get()
    let action = params.action
    let user = this.userInfo()
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

    let memberModelInstance = this.model('member')
    let projects = await memberModelInstance.where({ user_id: user.id }).select()
    let ids = projects.map(item => {
      return item.project_id
    })

    where = { id: ['IN', ids] }
    where = { ...where, ...params }

    data = await this.modelInstance.where(where).select()

    return this.success(data)
  }

  async postAction() {
    let pk = await this.modelInstance.getPk()
    let data = this.post()
    let user = this.userInfo()

    delete data[pk]

    if (think.isEmpty(data)) {
      return this.fail('data is empty')
    }

    data.user_id = user.id

    let id = await this.modelInstance.add(data)

    data.id = id

    let memberModelInstance = this.model('member')

    // `项目创建者`即为`拥有者`
    await memberModelInstance.add({
      project_id: id,
      user_id: user.id,
      is_owner: 1
    })

    return this.success(data)
  }

  async deleteAction() {
    if (!this.id) {
      return this.fail('params error')
    }
    let pk = await this.modelInstance.getPk()
    let rows = await this.modelInstance.where({ [pk]: this.id }).delete()
    return this.success({ affectedRows: rows })
  }

  async putAction() {
    if (!this.id) {
      return this.fail('params error')
    }

    let pk = await this.modelInstance.getPk()
    let data = this.post()

    delete data[pk]
    delete data.members
    delete data.owner
    delete data.created_at
    delete data.modified_at

    if (think.isEmpty(data)) {
      return this.fail('data is empty')
    }

    let rows = await this.modelInstance.where({ [pk]: this.id }).update(data)

    return this.success({ affectedRows: rows })
  }
}
