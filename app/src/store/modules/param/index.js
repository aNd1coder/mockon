import * as getters from './getters'
import * as actions from './actions'
import * as types from './mutation-types'

const initialState = {
  items: [],
  current: {}
}

const mutations = {
  [types.FETCH_PARAMS](state, payload){
    state.items = payload
  },
  [types.FETCH_PARAM](state, payload){
    state.current = payload
  },
  [types.CREATE_PARAM](state, payload){
    state.current = payload
    state.items.push(payload)
  },
  [types.UPDATE_PARAM](state, payload){
    state.current = payload

    state.items.forEach((item, index) => {
      if (item.id === payload.id) {
        state.items.splice(index, 1, payload)
      }
    })
  },
  [types.DELETE_PARAM](state, payload){
    state.current = null
    state.items.splice(state.items.indexOf(payload), 1)
  }
}

export default {
  state: { ...initialState },
  getters,
  actions,
  mutations
}
