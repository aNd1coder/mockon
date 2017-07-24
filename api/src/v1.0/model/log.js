'use strict'

export default class extends think.model.relation {
  relation = {
    user: {
      type: think.model.BELONG_TO
    },
    project: {
      type: think.model.BELONG_TO,
      relation: false
    }
  }

  init(...args) {
    super.init(...args)
  }
}
