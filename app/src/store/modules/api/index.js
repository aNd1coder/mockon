import Vue from 'vue'
import * as getters from './getters'
import * as actions from './actions'
import * as types from './mutation-types'

const initialState = {
  items: [],
  current: {}
}

const mutations = {
  [types.FETCH_APIS](state, payload) {
    state.items = payload
  },
  [types.FETCH_API](state, payload) {
    state.current = payload
  },
  [types.CREATE_API](state, payload) {
    state.current = payload
    state.items.push(payload)
  },
  [types.UPDATE_API](state, payload) {
    state.current = payload

    state.items.forEach((item, index) => {
      if (item.id === payload.id) {
        state.items.splice(index, 1, payload)
      }
    })
  },
  [types.UPDATE_API_BACKUP_URL](state, payload) {
    state.current.backup_url = payload
  },
  [types.DELETE_API](state, payload) {
    state.current = null
    state.items.splice(state.items.indexOf(payload), 1)
  },
  [types.APPEND_API_RESPONSE](state, payload) {
    if (state.current.id === payload.api_id) {
      if (state.current.response) {
        state.current.response.push(payload)
      } else {
        state.current.response = [payload]
      }
    }
  },
  [types.DELETE_API_RESPONSE](state, payload) {
    if (state.current.id === payload.api_id) {
      state.current.response.forEach((response, index) => {
        if (response.id === payload.id) {
          state.current.response.splice(index, 1)
        }
      })
    }
  },
  [types.UPDATE_API_RESPONSE](state, payload) {
    if (state.current.id === payload.api_id) {
      state.current.response.forEach((response, index) => {
        if (response.id === payload.id) {
          state.current.response.splice(index, 1, payload)
        }
      })
    }
  },
  [types.APPEND_API_RESPONSE_PARAM](state, payload) {
    if (state.current.id === payload.api_id) {
      state.current.response.forEach((response, index) => {
        if (response.id === payload.response_id) {
          if (state.current.response[index].param) {
            state.current.response[index].param.push(payload)
          } else {
            Vue.set(state.current.response[index], 'param', [payload])
          }
        }
      })
    }
  },
  [types.DELETE_API_RESPONSE_PARAM](state, payload) {
    if (state.current.id === payload.api_id) {
      state.current.response.forEach((response, rIndex) => {
        if (response.id === payload.response_id) {
          response.param.forEach((param, pIndex) => {
            if (payload.id) {
              if (param.id === payload.id) {
                state.current.response[rIndex].param.splice(pIndex, 1)
              }
            } else {
              if (param.param_id === payload.param_id) {
                state.current.response[rIndex].param.splice(pIndex, 1)
              }
            }
          })
        }
      })
    }
  },
  [types.UPDATE_API_RESPONSE_PARAM](state, payload) {
    if (state.current.id === payload.api_id) {
      state.current.response.forEach((response, rIndex) => {
        if (response.id === payload.response_id) {
          response.param.forEach((param, pIndex) => {
            if (param.id === payload.id) {
              state.current.response[rIndex].param.splice(pIndex, 1, payload)
            }
          })
        }
      })
    }
  }
}

export default {
  state: { ...initialState },
  getters,
  actions,
  mutations
}
