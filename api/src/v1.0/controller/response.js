'use strict'

import Base from './base.js'
import superAgent from 'superagent'

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
    let params = this.get()
    let action = params.action || ''
    let duplicate = action === 'duplicate'
    let user = this.userInfo()
    let BACKUP_API = 'http://192.168.193.32:9003/api/'
    let label = action === 'bindbackup' ? '接入' : '取消'

    if (!await this.memberOf(data.project_id)) {
      return this.fail('NOT_MEMBER')
    }

    if (action === 'bindbackup' || action === 'unbindbackup') {
      let response_id = data.response_id

      delete data.project_id
      delete data.response_id

      let result = await superAgent
        .post(BACKUP_API + (action === 'bindbackup' ? 'data' : 'cancel'))
        .set({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'MockonApi/v1.0'
        })
        .send({ skey: '7cbd19e2da63253502a773e28bf9fc42', data })
        .catch(error => {
          let body = JSON.parse(JSON.stringify(error.response.body))
          let message = JSON.parse(body.msg).map(error => {
            return error.message
          })

          return this.fail(message.join('，'))
        })

      if (Object.keys(result.body).length > 0) {
        if (result.body.rtn === 0) {
          let backup_url = action === 'bindbackup' ? result.body.data.backup : ''

          await model.where({ id: response_id }).update({ backup_url })

          return this.success(action === 'bindbackup' ? { backup_url } : '取消成功')
        } else {
          return this.fail(result.body.msg)
        }
      } else {
        return this.fail(`${label}兜底服务失败`)
      }
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

    data.id = await model.add(data)

    if (duplicate) {
      let paramModelInstance = this.model('param')

      params.forEach(async (param) => {
        if (param.id) {
          delete param.id
          delete param.created_at
          delete param.modified_at

          param.response_id = data.id
          param.user_id = user.id

          await paramModelInstance.add(param)
        }
      })
    }

    if (data.id) {
      let project = await this.model('project').setRelation(false).db(model.db()).where({ id: data.project_id }).find()

      await this.createLogger({
        description: `添加了项目【${project.name}】响应【${data.description}】`,
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
    let response = await model.where({ [pk]: this.id }).find()

    if (!await this.memberOf(response.project_id)) {
      return this.fail('NOT_MEMBER')
    }

    let rows = await model.transaction(async () => {
      await self.model('param').where({ response_id: this.id }).delete()
      await self.model('field').where({ response_id: this.id }).delete()

      return await model.where({ [pk]: this.id }).delete()
    })

    if (rows > 0) {
      let project = await this.model('project').setRelation(false).db(model.db()).where({ id: response.project_id }).find()

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

    let model = this.modelInstance
    let pk = await model.setRelation(false).getPk()
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

    let rows = await model.where({ [pk]: this.id }).update(data)

    if (rows > 0) {
      let project = await this.model('project').setRelation(false).db(model.db()).where({ id: data.project_id }).find()

      await this.createLogger({
        description: `更新了项目【${project.name}】响应【${data.description}】信息`,
        project_id: data.project_id
      })
    }

    return this.success({ affectedRows: rows })
  }
}
