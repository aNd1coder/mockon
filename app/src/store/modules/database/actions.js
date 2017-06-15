import Vue from 'vue'
import * as types from './mutation-types'

export async function fetchDatabases({ commit }, payload) {
  let result = await Vue.http.get('database', { params: payload })
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.FETCH_DATABASES, data)
  }

  return result.body
}

export async function fetchDatabase({ commit }, payload) {
  let result

  if (payload.id) {
    result = await Vue.http.get('database/' + payload.id)
  } else {
    result = await Vue.http.get('database', { params: { action: 'find', ...payload } })
  }

  if (result.body.code === 0) {
    commit(types.FETCH_DATABASE, result.body.data)
  }

  return result.body
}

export async function createDatabase({ commit }, payload) {
  let result = await Vue.http.post('database', payload)
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.CREATE_DATABASE, data)
  }

  return result.body
}

export async function deleteDatabase({ commit }, payload) {
  let result = await Vue.http.delete('database/' + payload.id)

  if (result.body.code === 0) {
    commit(types.DELETE_DATABASE, payload)
  }

  return result.body
}

export async function updateDatabase({ commit }, payload) {
  let result = await Vue.http.put('database/' + payload.id, payload)

  if (result.body.code === 0) {
    commit(types.UPDATE_DATABASE, payload)
  }

  return result.body
}
