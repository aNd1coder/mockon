import { http } from 'vue'
import * as types from './mutation-types'
import {
  APPEND_API_RESPONSE_PARAM,
  DELETE_API_RESPONSE_PARAM,
  UPDATE_API_RESPONSE_PARAM
} from '../api/mutation-types'

export async function fetchParams({ commit }, payload) {
  let result = await http.get('param', { params: payload })
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.FETCH_PARAMS, data)
  }

  return result.body
}

export async function fetchParam({ commit }, payload) {
  let result

  if (payload.id) {
    result = await http.get('param/' + payload.id)
  } else {
    result = await http.get('param', { params: { action: 'find', ...payload } })
  }

  if (result.body.code === 0) {
    commit(types.FETCH_TABLE, result.body.data)
  }

  return result.body
}

export async function createParam({ commit }, payload) {
  let result = await http.post('param', payload)
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.CREATE_PARAM, data)
    commit(APPEND_API_RESPONSE_PARAM, data)
  }

  return result.body
}

export async function deleteParam({ commit }, payload) {
  let result = await http.delete('param/' + payload.id)

  if (result.body.code === 0) {
    commit(types.DELETE_PARAM, payload)
    commit(DELETE_API_RESPONSE_PARAM, payload)
  }

  return result.body
}

export async function updateParam({ commit }, payload) {
  let result = await http.put('param/' + payload.id, payload)
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.UPDATE_PARAM, data)
    commit(UPDATE_API_RESPONSE_PARAM, data)
  }

  return result.body
}
