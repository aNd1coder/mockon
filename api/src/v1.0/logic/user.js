'use strict'

export default class extends think.logic.base {
  postAction() {
    let rules = {
      email: 'required|length:8,20',
      password: 'required|length:6,20'
    }

    let flag = this.validate(rules);
    if (!flag) {
      return this.fail(400, this.errors());
    }
  }
}
