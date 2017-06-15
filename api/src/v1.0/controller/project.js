'use strict'

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

      where = { id: ['IN', ids] }
      where = { ...where, ...params }
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

    if (id) {
      await this.createLogger({ description: `初始化了项目【${data.name}】`, project_id: this.id })
    }

    return this.success(data)
  }

  async deleteAction() {
    if (!this.id) {
      return this.fail('params error')
    }

    if (!await this.ownerOf(this.id)) {
      return this.fail('NOT_OWNER')
    }

    let rows = await this.modelInstance.transaction(async () => {
      // 删除成员
      let memberModelInstance = this.model('member').db(this.modelInstance.db())
      await memberModelInstance.where({ project_id: this.id }).delete()

      // 删除字段
      let fieldModelInstance = this.model('field').db(this.modelInstance.db())
      await fieldModelInstance.where({ project_id: this.id }).delete()

      // 删除参数
      let paramModelInstance = this.model('param').db(this.modelInstance.db())
      await paramModelInstance.where({ project_id: this.id }).delete()

      // 删除响应
      let responseModelInstance = this.model('response').db(this.modelInstance.db())
      await responseModelInstance.where({ project_id: this.id }).delete()

      // 删除接口
      let apiModelInstance = this.model('api').db(this.modelInstance.db())
      await apiModelInstance.where({ project_id: this.id }).delete()

      // 删除分组
      let moduleModelInstance = this.model('module').db(this.modelInstance.db())
      await moduleModelInstance.where({ project_id: this.id }).delete()

      let pk = await this.modelInstance.getPk()

      return await this.modelInstance.where({ [pk]: this.id }).delete()
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

    let pk = await this.modelInstance.getPk()
    let data = this.post()


    if (!await this.ownerOf(data)) {
      return this.fail('NOT_OWNER')
    }

    delete data[pk]
    delete data.members
    delete data.owner
    delete data.created_at
    delete data.modified_at

    if (think.isEmpty(data)) {
      return this.fail('data is empty')
    }

    let rows = await this.modelInstance.where({ [pk]: this.id }).update(data)

    if (rows > 0) {
      await this.createLogger({ description: `更新了项目【${data.name}】信息`, project_id: this.id })
    }

    return this.success({ affectedRows: rows })
  }
}
