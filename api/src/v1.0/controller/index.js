'use strict'

import Base from './base.js'

export default class extends Base {
  async getAction() {
    return this.success('Mockon')
  }
}
