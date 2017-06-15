'use strict'

import Mockjs from 'mockjs'

export default class extends think.controller.base {
  async indexAction() {
    let id = this.get('id')

    if (id) {
      let responseModelInstance = this.model('v1.0/response')
      let data = await responseModelInstance.where({ id: id }).find()

      if (data.is_mockjs) {
        try {
          data.body = JSON.stringify(Mockjs.mock(JSON.parse(data.body)))
        } catch (e) {

        }
      }

      if (data.jsonp_callback) {
        return this.jsonp(data.body)
      }

      return this.json(data.body)
    }
  }
}
