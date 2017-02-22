'use strict'

import Base from './base.js'

export default class extends Base {
  async getAction() {
    let data
    if (this.id) {
      let pk = await this.modelInstance.getPk()
      data = await this.modelInstance.where({ [pk]: this.id }).find()
      return this.success(data)
    }
    data = await this.modelInstance.select()
    return this.success(data)
  }

  async postAction() {
    let pk = await this.modelInstance.getPk()
    let data = this.post()
    let action
    let token

    delete data[pk]

    if (think.isEmpty(data)) {
      return this.fail('data is empty')
    }

    if (data.action) {
      action = data.action
      delete data.action
    }

    data.password = think.md5(data.password)

    if (action === 'signin') {
      data = await this.modelInstance.where(data).find()

      delete data.password

      if (think.isEmpty(data)) {
        return this.fail('SIGNIN_ERROR')
      } else {
        token = await this.createToken(data)
        data.token = token

        await this.createLogger({ title: '登录系统', user_id: data.id })

        return this.success(data)
      }
    } else if (action === 'signup') {
      let result = await this.modelInstance.where({ email: data.email }).select()

      if (result.length > 0) {
        return this.fail('EMAIL_EXIST')
      }

      // 基于注册 email 设定默认用户名
      data.username = think.md5(data.email).substring(0, 5)

      data.id = await this.modelInstance.add(data)
      delete data.password
      token = await this.createToken(data)

      let mailerService = this.service('mailer')
      let mailerServiceInstance = new mailerService()
      let url = this.baseUrl + '/user/active/' + token

      mailerServiceInstance.sendMail({
        to: data.email,
        cc: 'mockon@163.com',
        subject: '请激活您的 Mockon 帐号',
        text: `请复制连接 ${url} 到浏览器地址栏回车进行激活，有效期为 1 天，请尽快进行激活。`,
        html: `亲爱的用户 <a style="color:#20a0ff;font-weight: 700;text-decoration: none;" href="mailto:${data.email}">${data.email}</a> 您好！<br><br>
               恭喜您已成功注册 Mockon 账号：<br>
               <a href="${url}" style="color:#20a0ff;font-weight: 700;text-decoration: none;">点击这里激活，立即登录并启用</a><br>
               <span style="color:#999;font-size: 12px;">(该链接在24小时内有效，24小时后需要重新获取)。</span><br><br>
               如果上述文字点击无效，请把下面网页地址复制到浏览器地址栏中打开：<br>
               <a href="${url}" style="color:#000;">${url}</a><br><br>
               <span style="color:#999;font-size: 12px;">此为系统邮件，请勿回复</span>
              `,
        //attachments: [
        //  {
        //    filename: 'license.txt',
        //    path: 'https://raw.github.com/nodemailer/nodemailer/master/LICENSE'
        //  }
        //]
      })

      await this.createLogger({ title: '成功注册系统账户', user_id: data.id })

      return this.success(data)
    } else if (action === 'signout') {
      this.session()
    }
  }

  async deleteAction() {
    if (!this.id) {
      return this.fail('params error')
    }
    let pk = await this.modelInstance.getPk()
    let rows = await this.modelInstance.where({ [pk]: this.id }).delete()
    return this.success({ affectedRows: rows })
  }

  async putAction() {
    if (!this.id) {
      return this.fail('params error')
    }
    let pk = await this.modelInstance.getPk()
    let data = this.post()
    delete data[pk]
    if (think.isEmpty(data)) {
      return this.fail('data is empty')
    }
    let rows = await this.modelInstance.where({ [pk]: this.id }).update(data)
    return this.success({ affectedRows: rows })
  }
}
