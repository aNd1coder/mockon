import Vue from 'vue'
import * as types from './mutation-types'

export async function fetchMembers({ commit }, payload) {
  let result = await Vue.http.get('member', { params: payload })
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.FETCH_MEMBERS, data)
  }

  return result.body
}

export async function fetchMember({ commit }, payload) {
  let result

  if (payload.id) {
    result = await Vue.http.get('member/' + payload.id)
  } else {
    result = await Vue.http.get('member', { params: { action: 'find', ...payload } })
  }

  if (result.body.code === 0) {
    commit(types.FETCH_MEMBER, result.body.data)
  }

  return result.body
}

export async function createMember({ commit }, payload) {
  let result = await Vue.http.post('member', payload)
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.CREATE_MEMBER, data)
  }

  return result.body
}

export async function deleteMember({ commit }, payload) {
  let result = await Vue.http.delete('member/' + payload.id)

  if (result.body.code === 0) {
    commit(types.DELETE_MEMBER, payload)
  }

  return result.body
}

export async function updateMember({ commit }, payload) {
  let result = await Vue.http.put('member/' + payload.id, payload)

  if (result.body.code === 0) {
    commit(types.UPDATE_MEMBER, payload)
  }

  return result.body
}
