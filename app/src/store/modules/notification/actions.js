import Vue from 'vue'
import * as types from './mutation-types'

export async function fetchNotifications({ commit }, payload) {
  let result = await Vue.http.get('notification', { params: payload })
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.FETCH_NOTIFICATIONS, data)
  }

  return result.body
}

export async function fetchNotification({ commit }, payload) {
  let result

  if (payload.id) {
    result = await Vue.http.get('notification/' + payload.id)
  } else {
    result = await Vue.http.get('notification', { params: { action: 'find', ...payload } })
  }

  if (result.body.code === 0) {
    commit(types.FETCH_NOTIFICATION, result.body.data)
  }

  return result.body
}

export async function createNotification({ commit }, payload) {
  let result = await Vue.http.post('notification', payload)
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.CREATE_NOTIFICATION, data)
  }

  return result.body
}

export async function deleteNotification({ commit }, payload) {
  let result = await Vue.http.delete('notification/' + payload.id)

  if (result.body.code === 0) {
    commit(types.DELETE_NOTIFICATION, payload)
  }

  return result.body
}

export async function updateNotification({ commit }, payload) {
  let result = await Vue.http.put('notification/' + payload.id, payload)

  if (result.body.code === 0) {
    commit(types.UPDATE_NOTIFICATION, payload)
  }

  return result.body
}
