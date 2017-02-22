'use strict'

export default class extends think.model.relation {
  relation = {
    user: {
      type: think.model.BELONG_TO
    },
    table: {
      type: think.model.HAS_MANY
    },
  }

  init(...args) {
    super.init(...args)
  }
}
