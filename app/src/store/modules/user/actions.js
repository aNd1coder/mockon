import Vue from 'vue'
import * as types from './mutation-types'

export async function fetchUsers({ commit }, payload) {
  let result = await Vue.http.get('user', { params: { ...payload } })
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.FETCH_USERS, data)
  }

  return result.body
}

export async function fetchUser({ commit }, payload) {
  let result

  if (payload.id) {
    result = await Vue.http.get('user/' + payload.id)
  } else {
    result = await Vue.http.get('user', { params: { action: 'find', ...payload } })
  }

  if (result.body.code === 0) {
    commit(types.FETCH_USER, result.body.data)
  }

  return result.body
}

export async function deleteUser({ commit }, payload) {
  let result = await Vue.http.delete('user/' + payload.id)

  if (result.body.code === 0) {
    commit(types.DELETE_USER, payload)
  }

  return result.body
}

export async function updateUser({ commit }, payload) {
  let result = await Vue.http.put('user/' + payload.id, payload)

  if (result.body.code === 0) {
    commit(types.UPDATE_USER, payload)
  }

  return result.body
}

export async function mutateHasUreadNotification({ commit }, payload) {
  commit(types.MUTATE_HAS_UNREAD_NOTIFICATION, payload)
}

export async function signIn({ commit }, payload) {
  let result = await Vue.http.post('user', { action: 'signin', ...payload })
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.SESSION_SIGNIN, data)
  }

  return result.body
}

export async function passwordReset({ commit }, payload) {
  let result = await Vue.http.post('user', { action: 'password_reset', ...payload })
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.SESSION_SIGNIN, data)
  }

  return result.body
}

export async function signUp({ commit }, payload) {
  let result = await Vue.http.post('user', { action: 'signup', ...payload })
  return result.body
}

export async function signOut({ commit }) {
  await Vue.http.post('user', { action: 'signout' })
  commit(types.SESSION_SIGNOUT)
}
