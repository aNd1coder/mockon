'use strict'

import superAgent from 'superagent'
//import superAgentProxy from 'superagent-proxy'

export default class extends think.controller.base {
  async indexAction() {
    let data = this.post()

    if (Object.keys(data).length > 0) {
      let url = data.url || ''
      let method = data.method || 'get'
      let params = data.params || {}
      let querys = params.query || {}
      let bodys = params.body || {}
      let headers = params.header || {}
      let text

      method = method.toLowerCase()
      headers = {
        'Accept': data.enctype,
        ...headers
      }

      //superAgentProxy(superAgent)

      let response = await superAgent[method](url)
        .set(headers)
        .query(querys)
        .send(bodys)
      //.proxy('http://10.14.221.11:8888')

      if (!response.ok) {
        return this.fail(err)
      } else {
        text = response.text
        text = text.replace(/[\r\n]/g, '')

        if (!text.startsWith('{')) {
          text = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1)
        }

        return this.json(text)
      }
    }
  }
}
