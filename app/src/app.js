import Vue from 'vue'
import VueResource from 'vue-resource'
import '../static/font-awesome-4.7.0/css/font-awesome.min.css'
import '../theme/index.css'
import Element from 'element-ui'
import { API_ROOT } from './config'
import filters from './utils/filters'
import store from './store'
import {
  REFRESH_TOKEN,
  SESSION_SIGNOUT
} from './store/modules/user/mutation-types'
import router from './router'
import App from './app.vue'

Vue.use(Element)
Vue.use(VueResource)

Vue.http.options.root = API_ROOT
Vue.http.options.crossOrigin = true
// Vue.http.options.credentials = true
Vue.http.interceptors.push((request, next) => {
  let token = store.getters.token || localStorage.getItem('token') || false

  if (token) {
    request.headers = request.headers || {}
    request.headers.set('X-ACCESS-TOKEN', token)
    // request.headers.set('Authorization', `Bearer ${token}`)
  }

  next((response) => {
    token = response.headers.get('X-ACCESS-TOKEN')

    if (response.body.code === 401) {
      store.commit(SESSION_SIGNOUT)

      router.push({ name: 'signin', query: { next: router.history.current.fullPath } })
    }

    if (token) {
      store.commit(REFRESH_TOKEN, token)
    }
  })
})

const app = new Vue({
  el: '#app',
  store,
  router,
  ...App
})

export {
  app,
  router,
  store
}
