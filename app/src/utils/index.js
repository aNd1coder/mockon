import Vue from 'vue'
import VueCookie from 'vue-cookie'
import moment from 'moment'
import marked from 'marked'
import highlight from 'highlight.js'
import _ from 'lodash'
import { COOKIE_DOMAIN, COOKIE_EXPIRES } from '../config'

Vue.use(VueCookie)

let cookieConfig = {}

if (COOKIE_DOMAIN !== '') {
  cookieConfig = { expires: COOKIE_EXPIRES, domain: COOKIE_DOMAIN }
}

export function saveCookie(name, value) {
  Vue.cookie.set(name, value, cookieConfig)
}

export function getCookie(name) {
  return Vue.cookie.get(name)
}

export function removeCookie(name) {
  Vue.cookie.delete(name, cookieConfig)
}

export function dateFormatter(value, format) {
  return moment(value).format(format || 'YYYY-MM-DD HH:mm:ss')
}

export function jsonFormat(body, fields) {
  let htmlBlock = ''
  let space = '  '
  let index = 0
  let toString = Object.prototype.toString

  body = JSON.parse(JSON.stringify(body))

  htmlBlock += build(body, 1)

  function build(data, level) {
    let _level = level + 1
    let html = ''
    let isArrayData = Array.isArray(data)

    for (let attr in data) {
      let value = data[attr]
      let valueType = getType(value)

      if (valueType === 'array') {
        let htmlArray = ''

        htmlArray += buildAttr(attr, level) + ': ['

        if (value.length === 0) {
          htmlArray += '],' + buildComment(attr) + '\n'
        } else {
          htmlArray += buildComment(attr) + '\n'
          htmlArray += build(value, _level)
          htmlArray = _.trimEnd(htmlArray, '\n')
          htmlArray = _.trimEnd(htmlArray, ',')
          htmlArray += buildTail(']', level)
        }

        html += htmlArray
      } else if (valueType === 'object') {
        let htmlObject = ''
        let empty = Object.keys(value).length === 0

        htmlObject += isArrayData ? (padding(level) + '{') : (buildAttr(attr, level) + ': {')

        if (empty) {
          htmlObject += ',' + buildComment(attr) + '\n'
        } else {
          htmlObject += buildComment(attr) + '\n'
          htmlObject += build(value, _level)
          htmlObject = _.trimEnd(htmlObject, '\n')
          htmlObject = _.trimEnd(htmlObject, ',')
          htmlObject += buildTail('}', level)
        }

        html += htmlObject
      } else {
        html += (isArrayData ? padding(level) : (buildAttr(attr, level) + ': ')) + buildValue(valueType, value) + ',' + buildComment(attr) + '\n'
      }

      index++
    }

    return html
  }

  function getType(value) {
    return /\[object (\w+)\]/g.exec(toString.call(value))[1].toLowerCase()
  }

  function buildAttr(attr, level) {
    return padding(level) + '<span class="hljs-attr">"' + attr + '"</span>'
  }

  function buildValue(type, value) {
    value = type === 'string' ? '"' + value + '"' : value
    type = type === 'null' ? 'literal' : type
    return '<span class="hljs-' + type + '">' + value + '</span>'
  }

  function buildComment(attr) {
    let result = ''

    fields.forEach(field => {
      if (field.name === attr) {
        result = '<span class="hljs-comment"> //' + field.description + '</span>'
      }
    })

    return result
  }

  function buildTail(char, level) {
    return '\n' + padding(level) + '<span>' + char + '</span>,\n'
  }

  function padding(level) {
    let result = ''

    for (let i = 0; i < level; i++) {
      result += space
    }

    return result
  }

  htmlBlock = _.trimEnd(htmlBlock, '\n')
  htmlBlock = _.trimEnd(htmlBlock, ',')

  htmlBlock = '{\n' + htmlBlock + '\n}'

  return htmlBlock
}

export function flattenObject(originObject) {
  let result = {}

  for (let oKey in originObject) {
    if (!originObject.hasOwnProperty(oKey)) continue

    if (isNaN(oKey)) {
      result[oKey] = originObject[oKey]
    }

    if ((typeof originObject[oKey]) === 'object') {
      let deepObject = flattenObject(originObject[oKey])

      for (let dKey in deepObject) {
        if (!deepObject.hasOwnProperty(dKey)) continue

        if (isNaN(dKey)) {
          result[dKey] = deepObject[dKey]
        }
      }
    }
  }
  return result
}

const languages = ["cpp", "xml", "bash", "coffeescript", "css", "markdown", "http", "java", "javascript", "json", "less", "makefile", "nginx", "php", "python", "scss", "sql", "stylus"]
highlight.registerLanguage('cpp', require('highlight.js/lib/languages/cpp'))
highlight.registerLanguage('xml', require('highlight.js/lib/languages/xml'))
highlight.registerLanguage('bash', require('highlight.js/lib/languages/bash'))
highlight.registerLanguage('coffeescript', require('highlight.js/lib/languages/coffeescript'))
highlight.registerLanguage('css', require('highlight.js/lib/languages/css'))
highlight.registerLanguage('markdown', require('highlight.js/lib/languages/markdown'))
highlight.registerLanguage('http', require('highlight.js/lib/languages/http'))
highlight.registerLanguage('java', require('highlight.js/lib/languages/java'))
highlight.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'))
highlight.registerLanguage('json', require('highlight.js/lib/languages/json'))
highlight.registerLanguage('less', require('highlight.js/lib/languages/less'))
highlight.registerLanguage('makefile', require('highlight.js/lib/languages/makefile'))
highlight.registerLanguage('nginx', require('highlight.js/lib/languages/nginx'))
highlight.registerLanguage('php', require('highlight.js/lib/languages/php'))
highlight.registerLanguage('python', require('highlight.js/lib/languages/python'))
highlight.registerLanguage('scss', require('highlight.js/lib/languages/scss'))
highlight.registerLanguage('sql', require('highlight.js/lib/languages/sql'))
highlight.registerLanguage('stylus', require('highlight.js/lib/languages/stylus'))
highlight.configure({
  classPrefix: ''     // don't append class prefix
})

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  pedantic: false,
  sanitize: false,
  tables: true,
  breaks: true,
  smartLists: true,
  smartypants: true,
  highlight: function (code, lang) {
    if (!~languages.indexOf(lang)) {
      return highlight.highlightAuto(code).value
    }

    return highlight.highlight(lang, code).value
  }
})

export {
  marked
}


