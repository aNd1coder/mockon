'use strict'

export default class extends think.model.relation {
  relation = {
    user: {
      type: think.model.BELONG_TO
    },
    project: {
      type: think.model.BELONG_TO
    },
    module: {
      type: think.model.BELONG_TO,
      relation: false
    },
    response: {
      type: think.model.HAS_MANY
    }
  }

  init(...args) {
    super.init(...args)
  }
}
