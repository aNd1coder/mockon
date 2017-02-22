'use strict'
// https://jwt.io/
// https://github.com/auth0/node-jsonwebtoken
// https://cnodejs.org/topic/557d647216839d2d53936351
import jwt from 'jsonwebtoken'

let secret = think.config('jwt').secret
let expiresIn = think.config('jwt').expiresIn

export default class extends think.service.base {
  init(...args) {
    super.init(...args)
  }

  create(data) {
    let token = jwt.sign(data, secret, {
      expiresIn: expiresIn
    })

    return token
  }

  verify(token) {
    if (token) {
      try {
        let result = jwt.verify(token, secret)
        return result
      } catch (err) {
        return false
      }
    }

    return false
  }
}
