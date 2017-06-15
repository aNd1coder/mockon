import Vue from 'vue'
import * as types from './mutation-types'

export async function fetchErrors({ commit }, payload) {
  let result = await Vue.http.get('error', { params: payload })
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.FETCH_ERRORS, data)
  }

  return result.body
}

export async function fetchError({ commit }, payload) {
  let result

  if (payload.id) {
    result = await Vue.http.get('error/' + payload.id)
  } else {
    result = await Vue.http.get('error', { params: { action: 'find', ...payload } })
  }

  if (result.body.code === 0) {
    commit(types.FETCH_ERROR, result.body.data)
  }

  return result.body
}

export async function createError({ commit }, payload) {
  let result = await Vue.http.post('error', payload)
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.CREATE_ERROR, data)
  }

  return result.body
}

export async function deleteError({ commit }, payload) {
  let result = await Vue.http.delete('error/' + payload.id)

  if (result.body.code === 0) {
    commit(types.DELETE_ERROR, payload)
  }

  return result.body
}

export async function updateError({ commit }, payload) {
  let result = await Vue.http.put('error/' + payload.id, payload)

  if (result.body.code === 0) {
    commit(types.UPDATE_ERROR, payload)
  }

  return result.body
}
