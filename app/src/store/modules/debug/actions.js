import Vue from 'vue'
import * as types from './mutation-types'

export async function fetchDebugs({ commit }, payload) {
  let result = await Vue.http.get('debug', { params: payload })
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.FETCH_DEBUGS, data)
  }

  return result.body
}

export async function fetchDebug({ commit }, payload) {
  let result

  if (payload.id) {
    result = await Vue.http.get('debug/' + payload.id)
  } else {
    result = await Vue.http.get('debug', { params: { action: 'find', ...payload } })
  }

  if (result.body.code === 0) {
    commit(types.FETCH_DEBUG, result.body.data)
  }

  return result.body
}

export async function createDebug({ commit }, payload) {
  let result = await Vue.http.post('debug', payload)
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.CREATE_DEBUG, data)
  }

  return result.body
}

export async function deleteDebug({ commit }, payload) {
  let result = await Vue.http.delete('debug/' + payload.id)

  if (result.body.code === 0) {
    commit(types.DELETE_DEBUG, payload)
  }

  return result.body
}

export async function updateDebug({ commit }, payload) {
  let result = await Vue.http.put('debug/' + payload.id, payload)

  if (result.body.code === 0) {
    commit(types.UPDATE_DEBUG, payload)
  }

  return result.body
}
