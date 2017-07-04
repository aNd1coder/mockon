'use strict'

export default class extends think.model.relation {
  relation = {
    api: {
      type: think.model.HAS_MANY,
      relation: false
    }
  }

  init(...args) {
    super.init(...args)
  }
}
