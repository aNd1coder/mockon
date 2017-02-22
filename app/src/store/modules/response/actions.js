import { http } from 'vue'
import * as types from './mutation-types'
import {
  APPEND_API_RESPONSE,
  DELETE_API_RESPONSE,
  UPDATE_API_RESPONSE
} from '../api/mutation-types'

export async function fetchResponses({ commit }, payload) {
  let result = await http.get('response', { params: payload })
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.FETCH_RESPONSES, data)
  }

  return result.body
}

export async function fetchResponse({ commit }, payload) {
  let result

  if (payload.id) {
    result = await http.get('response/' + payload.id)
  } else {
    result = await http.get('response', { params: { action: 'find', ...payload } })
  }

  if (result.body.code === 0) {
    commit(types.FETCH_RESPONSE, result.body.data)
  }

  return result.body
}

export async function createResponse({ commit }, payload) {
  let result = await http.post('response', payload)
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.CREATE_RESPONSE, data)
    commit(APPEND_API_RESPONSE, data)
  }

  return result.body
}

export async function duplicateResponse({ commit }, payload) {
  let result = await http.post('response', payload, { params: { action: 'duplicate' } })
  let data = result.body.data

  if (result.body.code === 0) {
    data.param = payload.param

    commit(types.CREATE_RESPONSE, data)
    commit(APPEND_API_RESPONSE, data)
  }

  return result.body
}

export async function deleteResponse({ commit }, payload) {
  let result = await http.delete('response/' + payload.id)

  if (result.body.code === 0) {
    commit(types.DELETE_RESPONSE, payload)
    commit(DELETE_API_RESPONSE, payload)
  }

  return result.body
}

export async function updateResponse({ commit }, payload) {
  let result = await http.put('response/' + payload.id, payload)

  if (result.body.code === 0) {
    commit(types.UPDATE_RESPONSE, payload)
    commit(UPDATE_API_RESPONSE, payload)
  }

  return result.body
}
