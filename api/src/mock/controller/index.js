'use strict'

import ejs from 'ejs'
import Mockjs from 'mockjs'

export default class extends think.controller.base {
  async indexAction() {
    let params = this.get()
    let id = params.id
    let callback = params.callback
    let format = params.format

    delete params.id

    if (id) {
      try {
        id = new Buffer(id, 'base64').toString('utf8').replace('mockon_base64_salt', '')

        let responseModelInstance = this.model('v1.0/response')
        let data = await responseModelInstance.setRelation(false).where({ id: id }).find()
        let template = data.template
        let content = template ? ejs.render(template, params) : data.body

        content = JSON.parse(content)
        content = Mockjs.mock(content)
        callback = callback || data.jsonp_callback

        if (format === 'json') {
          JSON.stringify(content)
        } else {
          if (callback) {
            content = `${callback}(${JSON.stringify(content)})`
          }
        }

        return this.end(content)
      } catch (e) {
        return this.end(e)
      }
    }

    return this.json({})
  }
}
