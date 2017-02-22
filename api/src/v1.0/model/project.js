'use strict'

export default class extends think.model.relation {
  relation = {
    owner: {
      type: think.model.BELONG_TO,
      model: 'user',
    },
    members: {
      type: think.model.MANY_TO_MANY,
      model: 'user',
      rModel: 'member',
      rfKey: 'user_id'
    }
  }

  init(...args) {
    super.init(...args)
  }
}
