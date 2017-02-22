'use strict'

let userInfo = {}
let logModelInstance

export default class extends think.controller.rest {
  baseUrl = process.env.NODE_ENV === 'production'
    ? 'http://mockon.time33.com'
    : 'http://127.0.0.1:8088'

  async __before() {
    let method = this.http.method
    let param = this.param()
    let action = param.action || ''
    let ignore = false
    let actions = ['signin', 'signup', 'signout']

    if (method === 'POST' && actions.indexOf(action) > -1) {
      ignore = true
    }

    if (!ignore) {
      let token = this.http.header('X-ACCESS-TOKEN')
      let tokenService = think.service('token')
      let tokenServiceInstance = new tokenService()

      let result = await tokenServiceInstance.verify(token)

      if (result === false) {
        this.fail('TOKEN_INVALID')
      }

      userInfo = result.userInfo
      logModelInstance = this.model('log')

      token = await tokenServiceInstance.create({ userInfo })

      this.http.header('X-ACCESS-TOKEN', token)
    }
  }

  async createToken(userInfo) {
    let tokenService = think.service('token')
    let tokenServiceInstance = new tokenService()
    let token = await tokenServiceInstance.create({ userInfo })

    return token
  }

  async createLogger({ title = '', description = '', user_id, project_id = 0 }) {
    await logModelInstance.add({
      title,
      description,
      project_id,
      user_id: user_id || userInfo.id
    })
  }

  userInfo() {
    return userInfo || false
  }
}
