import Vue from 'vue'
import * as types from './mutation-types'

export async function fetchTables({ commit }, payload) {
  let result = await Vue.http.get('table', { params: payload })
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.FETCH_TABLES, data)
  }

  return result.body
}

export async function fetchTable({ commit }, payload) {
  let result

  if (payload.id) {
    result = await Vue.http.get('table/' + payload.id)
  } else {
    result = await Vue.http.get('table', { params: { action: 'find', ...payload } })
  }

  if (result.body.code === 0) {
    commit(types.FETCH_TABLE, result.body.data)
  }

  return result.body
}

export async function createTable({ commit }, payload) {
  let result = await Vue.http.post('table', payload)
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.CREATE_TABLE, data)
  }

  return result.body
}

export async function deleteTable({ commit }, payload) {
  let result = await Vue.http.delete('table/' + payload.id)

  if (result.body.code === 0) {
    commit(types.DELETE_TABLE, payload)
  }

  return result.body
}

export async function updateTable({ commit }, payload) {
  let result = await Vue.http.put('table/' + payload.id, payload)

  if (result.body.code === 0) {
    commit(types.UPDATE_TABLE, payload)
  }

  return result.body
}
