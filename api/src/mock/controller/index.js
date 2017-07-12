'use strict'

import querystring from 'querystring'
import Mockjs from 'mockjs'

export default class extends think.controller.base {
  async indexAction() {
    let params = this.get()
    let id = params.id

    delete params.id

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
        let callback = params.callback
        let body = JSON.parse(data.body)


        delete params.callback

        callback = callback || data.jsonp_callback
        body = { ...body, ...params }

        if (callback) {
          return this.end(callback + '(' + JSON.stringify(body) + ')')
        }
      }

      return this.json(data.body)
    }
  }
}
