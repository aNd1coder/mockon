'use strict'

import Base from './base.js'
import superAgent from 'superagent'

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
    let params = this.get()
    let action = params.action || ''
    let duplicate = action === 'duplicate'
    let user = this.userInfo()
    let BACKUP_API = 'http://data.nohup.site/api/'

    if (action === 'bindbackup' || action === 'unbindbackup') {
      let result = await superAgent
        .post(BACKUP_API + (action === 'bindbackup' ? 'data' : 'cancel'))
        .set('Accept', 'application/json')
        .send({ skey: '7cbd19e2da63253502a773e28bf9fc42', data })

      if (Object.keys(result.body).length > 0) {
        return this.success(result.body)
      } else {
        return this.fail('提交兜底服务数据失败')
      }
    }

    if (!await this.memberOf(data.project_id)) {
      return this.fail('NOT_MEMBER')
    }

    delete data[pk]
    delete data.created_at
    delete data.modified_at

    if (think.isEmpty(data)) {
      return this.fail('data is empty')
    }

    if (duplicate) {
      params = data.param
    }

    delete data.param

    data.user_id = user.id

    data.id = await this.modelInstance.add(data)

    if (duplicate) {
      let paramModelInstance = this.model('param')

      params.forEach(param => {
        if (param.id) {
          delete param.id
          delete param.created_at
          delete param.modified_at

          param.response_id = data.id
          param.user_id = user.id

          paramModelInstance.add(param)
        }
      })
    }

    if (data.id) {
      let projectModelInstance = this.model('project')
      let project = await projectModelInstance.where({ id: data.project_id }).find()

      await this.createLogger({
        description: `添加了项目【${project.name}】响应【${data.description}】`,
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
    let response = await this.modelInstance.where({ [pk]: this.id }).find()

    if (!await this.memberOf(response.project_id)) {
      return this.fail('NOT_MEMBER')
    }

    let rows = await this.modelInstance.transaction(async () => {
      let paramModelInstance = this.model('param')
      let fieldModelInstance = this.model('field')

      paramModelInstance.where({ response_id: this.id }).delete()
      fieldModelInstance.where({ response_id: this.id }).delete()

      return await this.modelInstance.where({ [pk]: this.id }).delete()
    })

    if (rows > 0) {
      let projectModelInstance = this.model('project')
      let project = await projectModelInstance.where({ id: response.project_id }).find()

      await this.createLogger({
        description: `删除了项目【${project.name}】响应【${response.description}】及关联数据`,
        project_id: response.project_id
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
    delete data.param
    delete data.created_at
    delete data.modified_at

    if (think.isEmpty(data)) {
      return this.fail('data is empty')
    }

    let rows = await this.modelInstance.where({ [pk]: this.id }).update(data)

    if (rows > 0) {
      let projectModelInstance = this.model('project')
      let project = await projectModelInstance.where({ id: data.project_id }).find()

      await this.createLogger({
        description: `更新了项目【${project.name}】响应【${data.description}】信息`,
        project_id: data.project_id
      })
    }

    return this.success({ affectedRows: rows })
  }
}
