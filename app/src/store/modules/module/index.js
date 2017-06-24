import * as getters from './getters'
import * as actions from './actions'
import * as types from './mutation-types'

const initialState = {
  items: [],
  current: {}
}

const mutations = {
  [types.FETCH_MODULES](state, payload){
    state.items = payload
  },
  [types.FETCH_MODULE](state, payload){
    state.current = payload
  },
  [types.CREATE_MODULE](state, payload){
    state.current = payload
    state.items.push(payload)
  },
  [types.UPDATE_MODULE](state, payload){
    state.current = payload

    state.items.forEach((item, index) => {
      if (item.id === payload.id) {
        state.items.splice(index, 1, payload)
      }
    })
  },
  [types.DELETE_MODULE](state, payload){
    state.current = null
    state.items.splice(state.items.indexOf(payload), 1)
  },
  [types.APPEND_MODULE_API](state, payload){
    state.items.forEach(module => {
      if (module.id === payload.module_id) {
        if (module.api) {
          module.api.push(payload)
        } else {
          module.api = [payload]
        }
      }
    })
  },
  [types.DELETE_MODULE_API](state, payload){
    state.items.forEach(module => {
      if (module.id === payload.module_id) {
        module.api.splice(module.api.indexOf(payload), 1)
      }
    })
  },
  [types.UPDATE_MODULE_API](state, payload){
    state.items.forEach(module => {
      if (module.id === payload.module_id) {
        module.api.forEach((api, index) => {
          if (payload.id === api.id) {
            module.api.splice(index, 1, payload)
          }
        })
      }
    })
  },
}

export default {
  state: { ...initialState },
  getters,
  actions,
  mutations
}
