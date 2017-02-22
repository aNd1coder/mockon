import { http } from 'vue'
import * as types from './mutation-types'

export async function fetchLogs({ commit }, payload) {
  let result = await http.get('log', { params: payload })
  let data = result.body.data.data

  if (result.body.code === 0) {
    if (payload.page === 1) {
      commit(types.FETCH_LOGS, data)
    } else {
      commit(types.APPEND_LOGS, data)
    }
  }

  return result.body
}

export async function fetchLog({ commit }, payload) {
  let result

  if (payload.id) {
    result = await http.get('log/' + payload.id)
  } else {
    result = await http.get('log', { params: { action: 'find', ...payload } })
  }

  if (result.body.code === 0) {
    commit(types.FETCH_LOG, result.body.data)
  }

  return result.body
}

export async function createLog({ commit }, payload) {
  let result = await http.post('log', payload)
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.CREATE_LOG, data)
  }

  return result.body
}

export async function deleteLog({ commit }, payload) {
  let result = await http.delete('log/' + payload.id)

  if (result.body.code === 0) {
    commit(types.DELETE_LOG, payload)
  }

  return result.body
}

export async function updateLog({ commit }, payload) {
  let result = await http.put('log/' + payload.id, payload)

  if (result.body.code === 0) {
    commit(types.UPDATE_LOG, payload)
  }

  return result.body
}
