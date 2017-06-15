import Vue from 'vue'
import moment from 'moment'
import { STATIC_URL } from '../config'
import { marked } from '../utils'

Vue.filter('marked', function (value) {
  return marked(value)
})

Vue.filter('dateformat', function (value) {
  return moment(value, 'YYYY-MM-DD HH:mm:ss', 'zh-cn').fromNow()
})

Vue.filter('displayName', function (value) {
  return value.nickname || value.username || value.email || value.mobile
})

Vue.filter('imgformat', function (value) {
  if (!value || value.trim() === '') {
    return 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=='
  } else if (value.indexOf('//') != -1) {
    return value
  } else {
    return STATIC_URL + '/upload/' + value
  }
})
