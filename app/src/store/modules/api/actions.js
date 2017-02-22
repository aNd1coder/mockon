import { http } from 'vue'
import * as types from './mutation-types'

export async function fetchApis({ commit }, payload) {
  let result = await http.get('api', { params: payload })
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.FETCH_APIS, data)
  }

  return result.body
}

export async function fetchApi({ commit }, payload) {
  let result

  if (payload.id) {
    result = await http.get('api/' + payload.id)
  } else {
    result = await http.get('api', { params: { action: 'find', ...payload } })
  }

  if (result.body.code === 0) {
    commit(types.FETCH_API, result.body.data)
  }

  return result.body
}

export async function createApi({ commit }, payload) {
  let result = await http.post('api', payload)
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.CREATE_API, data)
  }

  return result.body
}

export async function deleteApi({ commit }, payload) {
  let result = await http.delete('api/' + payload.id)

  if (result.body.code === 0) {
    commit(types.DELETE_API, payload)
  }

  return result.body
}

export async function updateApi({ commit }, payload) {
  let result = await http.put('api/' + payload.id, payload)

  if (result.body.code === 0) {
    commit(types.UPDATE_API, payload)
  }

  return result.body
}

export async function appendApiResponseParam({ commit }, payload) {
  commit(types.APPEND_API_RESPONSE_PARAM, payload)
}

export async function deleteApiResponseParam({ commit }, payload) {
  commit(types.DELETE_API_RESPONSE_PARAM, payload)
}
