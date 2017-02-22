'use strict'

export default class extends think.model.relation {
  relation = {
    user: {
      type: think.model.BELONG_TO,
    }
  }

  init(...args) {
    super.init(...args)
  }
}
