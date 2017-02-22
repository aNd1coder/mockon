import { http } from 'vue'
import * as types from './mutation-types'

export async function fetchProjects({ commit }, payload) {
  let result = await http.get('project', { params: payload })
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.FETCH_PROJECTS, data)
  }

  return result.body
}

export async function fetchProject({ commit }, payload) {
  let result

  if (payload.id) {
    result = await http.get('project/' + payload.id)
  } else {
    result = await http.get('project', { params: { action: 'find', ...payload } })
  }

  if (result.body.code === 0) {
    commit(types.FETCH_PROJECT, result.body.data)
  }

  return result.body
}

export async function createProject({ commit }, payload) {
  let result = await http.post('project', payload)
  let data = result.body.data

  if (result.body.code === 0) {
    commit(types.CREATE_PROJECT, data)
  }

  return result.body
}

export async function updateProject({ commit }, payload) {
  let result = await http.put('project/' + payload.id, payload)

  if (result.body.code === 0) {
    commit(types.UPDATE_PROJECT, payload)
  }

  return result.body
}
