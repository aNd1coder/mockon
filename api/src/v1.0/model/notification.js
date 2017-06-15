'use strict'

export default class extends think.model.relation {
  relation = {
    author: {
      type: think.model.BELONG_TO,
      model: 'user',
      key: 'author_id',
      fKey: 'id',
      field: 'id,username,nickname'
    },
    project: {
      type: think.model.BELONG_TO,
      field: 'id,name,code'
    },
    user: {
      type: think.model.BELONG_TO,
      field: 'id,username,nickname'
    }
  }

  init(...args) {
    super.init(...args)
  }
}
