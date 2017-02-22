import nodemailer from 'nodemailer'

// https://github.com/nodemailer/nodemailer
let brand = think.config('mailer').brand
let user = think.config('mailer').user
let pass = think.config('mailer').pass
let transporter = nodemailer.createTransport({
  service: 'QQ',
  host: 'smtp.qq.com',
  secureConnection: true,
  port: 465,
  auth: { user, pass }
})

export default class extends think.service.base {
  init(...args) {
    super.init(...args)
  }

  sendMail(options, errorCallback, successCallback) {
    let mailOptions = Object.assign({ from: brand + '<' + user + '>' }, options)

    transporter.sendMail(mailOptions, function (error, response) {
      if (error) {
        errorCallback && errorCallback(error)
      } else {
        successCallback && successCallback(response)
      }

      transporter.close()
    })
  }
}


