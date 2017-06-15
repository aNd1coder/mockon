import * as getters from './getters'
import * as actions from './actions'
import * as types from './mutation-types'

const userInfo = localStorage.getItem('userInfo')
const session = userInfo ? JSON.parse(userInfo) : ''
const token = localStorage.getItem('token') || ''
const initialState = {
  items: [],
  current: {},
  session,
  token
}

const mutations = {
  [types.FETCH_USERS](state, payload) {
    state.items = payload
  },
  [types.FETCH_USER](state, payload) {
    state.current = payload
  },
  [types.SESSION_SIGNIN](state, payload) {
    if (payload.token) {
      localStorage.setItem('token', payload.token)
      state.token = payload.token
      delete  payload.token
    }
    localStorage.setItem('userInfo', JSON.stringify(payload))
    state.current = payload
    state.session = payload
  },
  [types.SESSION_SIGNOUT](state) {
    state.token = null
    state.items = null
    state.current = null
    state.session = null

    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  },
  [types.REFRESH_TOKEN](state, payload) {
    localStorage.setItem('token', payload)
    state.token = payload
  }
}

export default {
  state: { ...initialState },
  getters,
  actions,
  mutations
}
