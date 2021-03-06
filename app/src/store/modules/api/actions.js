import Vue from 'vue'
import * as types from './mutation-types'
import {
  APPEND_MODULE_API,
  DELETE_MODULE_API,
  UPDATE_MODULE_API
} from '../../modules/module/mutation-types'

export async function fetchApis({ commit }, payload) {
  let result = await Vue.http.get('api', { params: payload })
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.FETCH_APIS, data)
  }

  return result.body
}

export async function fetchApi({ commit }, payload) {
  let result

  if (payload.id) {
    result = await Vue.http.get('api/' + payload.id)
  } else {
    result = await Vue.http.get('api', { params: { action: 'find', ...payload } })
  }

  if (result.body.code === 0) {
    commit(types.FETCH_API, result.body.data)
  }

  return result.body
}

export async function createApi({ commit }, payload) {
  let result = await Vue.http.post('api', payload)
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.CREATE_API, data)
    commit(APPEND_MODULE_API, data)
  }

  return result.body
}

export async function duplicateApi({ commit }, payload) {
  let result = await Vue.http.post('api', payload, { params: { action: 'duplicate' } })
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.CREATE_API, data)
    commit(APPEND_MODULE_API, data)
  }

  return result.body
}

export async function deleteApi({ commit }, payload) {
  let result = await Vue.http.delete('api/' + payload.id)

  if (result.body.code === 0) {
    commit(types.DELETE_API, payload)
    commit(DELETE_MODULE_API, payload)
  }

  return result.body
}

export async function updateApi({ commit }, payload) {
  let result = await Vue.http.put('api/' + payload.id, payload)

  if (result.body.code === 0) {
    commit(types.UPDATE_API, payload)
    commit(UPDATE_MODULE_API, payload)
  }

  return result.body
}
