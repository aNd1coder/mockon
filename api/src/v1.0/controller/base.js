'use strict'

let userInfo = {}
let logModelInstance
let userModelInstance
let memberModelInstance

export default class extends think.controller.rest {
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

  async createLogger({ description = '', before_data, after_data, project_id = 0, user_id }) {
    user_id = user_id || userInfo.id

    logModelInstance = this.model('log')
    userModelInstance = this.model('user')

    // 通知其他成员
    if (project_id !== 0) {
      let members = memberModelInstance.where({ project_id }).select()

      for (let member of members) {
        if (member.user_id !== user_id) {
          userModelInstance.where({ id: member.user_id }).update({ has_unread_notification: 1 })
        }
      }
    }

    return await logModelInstance.add({
      description,
      before_data,
      after_data,
      project_id,
      user_id
    })
  }

  async ownerOf(project) {
    let projectId
    let members

    if (typeof project === 'object') {
      projectId = project.id
    } else {
      projectId = project
    }

    memberModelInstance = this.model('member')
    members = await memberModelInstance.where({ project_id: projectId, user_id: userInfo.id, is_owner: 1 }).select()

    return members.length > 0
  }

  async memberOf(project_id) {
    let members

    memberModelInstance = this.model('member')
    members = await memberModelInstance.where({ project_id: project_id, user_id: userInfo.id }).select()

    return members.length > 0
  }

  userInfo() {
    return userInfo || false
  }
}
