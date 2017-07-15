import Vue from 'vue'
import * as types from './mutation-types'

export async function fetchProjects({ commit }, payload) {
  let result = await Vue.http.get('project', { params: payload })
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.FETCH_PROJECTS, data)
  }

  return result.body
}

export async function fetchProject({ commit }, payload) {
  let result

  if (payload.id) {
    result = await Vue.http.get('project/' + payload.id)
  } else {
    result = await Vue.http.get('project', { params: { action: 'find', ...payload } })
  }

  if (result.body.code === 0) {
    commit(types.FETCH_PROJECT, result.body.data)
  }

  return result.body
}

export async function createProject({ commit }, payload) {
  let result = await Vue.http.post('project', payload)
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.CREATE_PROJECT, data)
  }

  return result.body
}

export async function updateProject({ commit }, payload) {
  let result = await Vue.http.put('project/' + payload.id, payload)

  if (result.body.code === 0) {
    commit(types.UPDATE_PROJECT, payload)
  }

  return result.body
}

export async function deleteProject({ commit }, payload) {
  let result = await Vue.http.delete('project/' + payload.id)

  if (result.body.code === 0) {
    commit(types.DELETE_PROJECT, payload)
  }

  return result.body
}

export async function updateProjectSwagger({ commit }, payload) {
  let result = await Vue.http.put('project/' + payload.id, payload, { params: { action: 'update-swagger' } })

  if (result.body.code === 0) {
    commit(types.UPDATE_PROJECT, payload)
  }

  return result.body
}
