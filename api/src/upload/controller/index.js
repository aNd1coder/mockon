'use strict'

import fs from 'fs'
import path from 'path'
import moment from 'moment'

export default class extends think.controller.base {
  indexAction() {
    let file = this.file()

    if (Object.keys(file).length > 0) {
      let filepath = file.file.path
      let filename = file.file.originalFilename
      let date = moment().format('YYYYMMDD')
      let uploadPath = think.RESOURCE_PATH + '/static/upload/' + date

      think.mkdir(uploadPath)

      fs.renameSync(filepath, uploadPath + '/' + filename)
      file.path = uploadPath + '/' + filename

      if (think.isFile(file.path)) {
        this.success(date + '/' + filename)
      } else {
        this.fail('not exist')
      }
    }
  }
}
