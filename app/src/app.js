import Vue from 'vue'
import VueResource from 'vue-resource'
import ApolloClient, { createNetworkInterface, addTypename } from 'apollo-client'
import VueApollo, { addGraphQLSubscriptions } from 'vue-apollo'
import '../static/font-awesome-4.7.0/css/font-awesome.min.css'
import '../theme/index.css'
import Element from 'element-ui'
import { API_ROOT, GRAPHQL_URI } from './config'
import { getCookie } from './utils'
import filters from './utils/filters'
import store from './store'
import {
  REFRESH_TOKEN,
  SESSION_SIGNOUT
} from './store/modules/user/mutation-types'
import router from './router'
import App from './app.vue'

const networkInterface = createNetworkInterface({
  uri: GRAPHQL_URI,
  transportBatching: true
})
const apolloClient = new ApolloClient({
  networkInterface,
  queryTransformer: addTypename,
  dataIdFromObject: r => r.id
})

Vue.use(VueApollo, { apolloClient })
Vue.use(Element)
Vue.use(VueResource)

Vue.http.options.root = API_ROOT
Vue.http.options.crossOrigin = true
// Vue.http.options.credentials = true
Vue.http.interceptors.push((request, next) => {
  let token = getCookie('token') || store.getters.token || false

  if (token) {
    request.headers = request.headers || {}
    request.headers.set('X-ACCESS-TOKEN', token)
    // request.headers.set('Authorization', `Bearer ${token}`)
  }

  next((response) => {
    token = response.headers.get('X-ACCESS-TOKEN')

    if (response.body.code === 401) {
      let next = router.history.current.fullPath

      store.commit(SESSION_SIGNOUT)

      // return { name: 'signin', query: { next } }
    }

    if (token) {
      store.commit(REFRESH_TOKEN, token)
    }
  })
})

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

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
