import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import project from './modules/project'
import module from './modules/module'
import api from './modules/api'
import response from './modules/response'
import param from './modules/param'
import field from './modules/field'
import member from './modules/member'
import error from './modules/error'
import log from './modules/log'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    user,
    project,
    module,
    api,
    response,
    param,
    field,
    member,
    error,
    log,
  },
  strict: debug,
})
