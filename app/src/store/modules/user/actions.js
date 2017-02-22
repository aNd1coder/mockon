import { http } from 'vue'
import * as types from './mutation-types'

export async function fetchUsers({ commit }, payload) {
  let result = await http.get('user', payload)
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.FETCH_USERS, data)
  }

  return result.body
}

export async function fetchUser({ commit }, payload) {
  let result

  if (payload.id) {
    result = await http.get('api/' + payload.id)
  } else {
    result = await http.get('api', { params: { action: 'find', ...payload } })
  }

  if (result.body.code === 0) {
    commit(types.FETCH_USER, result.body.data)
  }

  return result.body
}

export async function deleteUser({ commit }, payload) {
  let result = await http.delete('user/' + payload.id)

  if (result.body.code === 0) {
    commit(types.DELETE_USER, payload)
  }

  return result.body
}

export async function updateUser({ commit }, payload) {
  let result = await http.put('user/' + payload.id, payload)

  if (result.body.code === 0) {
    commit(types.UPDATE_USER, payload)
  }

  return result.body
}

export async function signIn({ commit }, payload) {
  let result = await http.post('user', { action: 'signin', ...payload })
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.FETCH_USER, data)
  }

  return result.body
}

export async function signUp({ commit }, payload) {
  let result = await http.post('user', { action: 'signup', ...payload })
  return result.body
}

export async function signOut({ commit }) {
  await http.post('user', { action: 'signout' })
  commit(types.SESSION_SIGNOUT)
}
