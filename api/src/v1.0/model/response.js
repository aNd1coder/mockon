'use strict'

export default class extends think.model.relation {
  relation = {
    param: {
      type: think.model.HAS_MANY
    }
  }

  init(...args) {
    super.init(...args)
  }
}
