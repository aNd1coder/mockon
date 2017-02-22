'use strict'

import Base from './base.js'

export default class extends Base {
  async getAction() {
    let data
    let params = this.get()
    let page = params.page || 1
    let limit = params.limit || 10
    let where = {}

    if (this.id) {
      let pk = await this.modelInstance.getPk()
      data = await this.modelInstance.where({ [pk]: this.id }).find()
      return this.success(data)
    }

    delete params.page
    delete params.limit

    for (let field in params) {
      if (field === 'title') {
        where[field] = ["like", `%${params[field]}%`]
      } else {
        where[field] = params[field]
      }
    }

    data = await this.modelInstance
      .where(where)
      .order({ id: "DESC" })
      .page([page, limit])
      .countSelect()

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
    data.id = await this.modelInstance.add(data)

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
    if (think.isEmpty(data)) {
      return this.fail('data is empty')
    }
    let rows = await this.modelInstance.where({ [pk]: this.id }).update(data)
    return this.success({ affectedRows: rows })
  }
}
