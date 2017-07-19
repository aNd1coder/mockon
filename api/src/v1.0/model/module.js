'use strict'

export default class extends think.model.relation {
  relation = {
    api: {
      type: think.model.HAS_MANY
    }
  }

  init(...args) {
    super.init(...args)
  }
}
