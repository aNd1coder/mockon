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
import notification from './modules/notification'
import debug from './modules/debug'

Vue.use(Vuex)

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
    notification,
    debug
  },
  strict: process.env.NODE_ENV !== 'production',
})
