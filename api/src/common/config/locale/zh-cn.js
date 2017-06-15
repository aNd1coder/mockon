'use strict'

export default {
  TOKEN_INVALID: [401, '无效的 token'],
  SIGNIN_ERROR: [10001, '账户或密码错误'],
  EMAIL_EXIST: [10002, '邮箱已存在'],
  NOT_OWNER: [10003, '项目拥有者才可操作'],
  NOT_MEMBER: [10004, '项目成员才可操作'],
}
