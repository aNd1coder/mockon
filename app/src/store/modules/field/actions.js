import Vue from 'vue'
import * as types from './mutation-types'

export async function fetchFields({ commit }, payload) {
  let result = await Vue.http.get('field', { params: payload })
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.FETCH_FIELDS, data)
  }

  return result.body
}

export async function fetchField({ commit }, payload) {
  let result

  if (payload.id) {
    result = await Vue.http.get('field/' + payload.id)
  } else {
    result = await Vue.http.get('field', { params: { action: 'find', ...payload } })
  }

  if (result.body.code === 0) {
    commit(types.FETCH_FIELD, result.body.data)
  }

  return result.body
}

export async function createField({ commit }, payload) {
  let result = await Vue.http.post('field', payload)
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.CREATE_FIELD, data)
  }

  return result.body
}

export async function deleteField({ commit }, payload) {
  let result = await Vue.http.delete('field/' + payload.id)

  if (result.body.code === 0) {
    commit(types.DELETE_FIELD, payload)
  }

  return result.body
}

export async function updateField({ commit }, payload) {
  let result = await Vue.http.put('field/' + payload.id, payload)

  if (result.body.code === 0) {
    commit(types.UPDATE_FIELD, payload)
  }

  return result.body
}
