'use strict'

import Mockjs from 'mockjs'

export default class extends think.controller.base {
  async indexAction() {
    let id = this.get('id')

    id = new Buffer(id, 'base64').toString('utf8').replace('mockon_base64_salt', '')

    if (id) {
      let responseModelInstance = this.model('v1.0/response')
      let data = await responseModelInstance.setRelation(false).where({ id: id }).find()

      if (data.is_mockjs) {
        try {
          data.body = JSON.stringify(Mockjs.mock(JSON.parse(data.body)))
        } catch (e) {

        }
      }

      if (this.isGet()) {
        if (data.jsonp_callback) {
          return this.end(data.jsonp_callback + '(' + data.body + ')')
        }
      }

      return this.json(data.body)
    }
  }
}
