import Vue from 'vue'
import * as types from './mutation-types'

export async function fetchModules({ commit }, payload) {
  let result = await Vue.http.get('module', { params: payload })
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.FETCH_MODULES, data)
  }

  return result.body
}

export async function fetchModule({ commit }, payload) {
  let result

  if (payload.id) {
    result = await Vue.http.get('module/' + payload.id)
  } else {
    result = await Vue.http.get('module', { params: { action: 'find', ...payload } })
  }

  if (result.body.code === 0) {
    commit(types.FETCH_MODULE, result.body.data)
  }

  return result.body
}

export async function createModule({ commit }, payload) {
  let result = await Vue.http.post('module', payload)
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.CREATE_MODULE, data)
  }

  return result.body
}

export async function deleteModule({ commit }, payload) {
  let result = await Vue.http.delete('module/' + payload.id)

  if (result.body.code === 0) {
    commit(types.DELETE_MODULE, payload)
  }

  return result.body
}

export async function updateModule({ commit }, payload) {
  let result = await Vue.http.put('module/' + payload.id, payload)

  if (result.body.code === 0) {
    commit(types.UPDATE_MODULE, payload)
  }

  return result.body
}
