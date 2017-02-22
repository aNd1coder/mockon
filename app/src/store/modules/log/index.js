import * as getters from './getters'
import * as actions from './actions'
import * as types from './mutation-types'

const initialState = {
  items: []
}

const mutations = {
  [types.FETCH_LOGS](state, payload){
    state.items = payload
  },
  [types.APPEND_LOGS](state, payload){
    state.items = state.items.concat(payload)
  },
  [types.CREATE_LOG](state, payload){
    state.items.push(payload)
  }
}

export default {
  state: { ...initialState },
  getters,
  actions,
  mutations
}
