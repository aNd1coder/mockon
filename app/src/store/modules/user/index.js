import * as getters from './getters'
import * as actions from './actions'
import * as types from './mutation-types'
import { getCookie, saveCookie, removeCookie } from '../../../utils'

const userInfo = getCookie('userInfo')
const current = userInfo ? JSON.parse(userInfo) : ''
const token = getCookie('token') || ''
const initialState = {
  items: [],
  current,
  token
}

const mutations = {
  [types.FETCH_USERS](state, payload) {
    state.items = payload
  },
  [types.FETCH_USER](state, payload) {
    if (payload.token) {
      saveCookie('token', payload.token)
      state.token = payload.token
      delete  payload.token
    }
    saveCookie('userInfo', JSON.stringify(payload))
    state.current = payload
  },
  [types.SESSION_SIGNOUT](state) {
    state.token = null
    state.items = null
    state.current = null

    removeCookie('token')
    removeCookie('userInfo')
  },
  [types.REFRESH_TOKEN](state, payload) {
    saveCookie('token', payload)
    state.token = payload
  }
}

export default {
  state: { ...initialState },
  getters,
  actions,
  mutations
}
