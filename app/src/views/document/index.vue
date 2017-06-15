<template>
  <div :class="wrapClass">
    <div class="document-summary">
      <div class="document-search-input">
        <i class="fa fa-search"></i>
        <input type="text" placeholder="输入关键字搜索...">
      </div>
      <ul v-if="modules.length > 0" class="summary">
        <li v-for="module in modules" :key="module.id">
          <span class="module-name">{{ module.name }}</span>
          <ul v-if="module.api.length > 0">
            <li v-for="ma in module.api" :key="ma.id" :class="{ 'active': ma.id === api.id }">
              <router-link :to="{ name: 'document-view', params: { id: ma.id } }">
                <el-http-method :method="ma.method"></el-http-method> {{ ma.name }}
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="document-debugger">
      <h1 class="page-header">
        接口调试
        <i class="el-icon-close" @click="withDebugger = false"></i>
      </h1>
      <el-row>
        <el-col :span="8">
          <el-input style="display: none;" v-model="keyword" placeholder="请输入关键词..." icon="search"></el-input>
          <h3>调试记录</h3>
          <ul v-if="debugs.length > 0" class="debugs">
            <li v-for="debug in debugs" class="debug" @click="handleDebugClick(debug)">
              <el-http-method :method="parseDebugData(debug).method"></el-http-method>
              {{ parseDebugData(debug).url }}
              <i class="fa fa-close" title="删除" @click="handleDebugDelete(debug)"></i>
            </li>
          </ul>
          <el-nodata v-else></el-nodata>
        </el-col>
        <el-col :span="16">
          <el-form :model="form" :rules="rules" ref="form" @submit.native.prevent="handleSubmit">
            <el-form-item label="接口地址" prop="url">
              <el-input type="text" v-model="form.url" placeholder="接口地址"></el-input>
            </el-form-item>
            <el-form-item label="请求方法" prop="method">
              <el-select v-model="form.method" placeholder="请选择请求方法">
                <el-option v-for="method in HTTP_METHOD" :key="method" :label="method" :value="method"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="编码类型" prop="enctype">
              <el-select v-model="form.enctype" placeholder="请选择编码类型">
                <el-option v-for="enctype in FORM_ENCTYPE" :key="enctype" :label="enctype" :value="enctype"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="请求方式" prop="type">
              <el-select v-model="form.type" placeholder="请选择请求方式">
                <el-option label="正常接口" value=""></el-option>
                <el-option label="模拟接口" value="mock"></el-option>
                <el-option label="代理接口" value="proxy"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="请求参数">
              <el-form-item v-for="(param, index) in form.params" :key="param.id">
                <el-input type="text" v-model="param.default_value" placeholder="参数值">
                  <template slot="prepend">
                    <el-select v-model="param.location" placeholder="参数位置">
                      <el-option v-for="(label, location) in PARAM_LOCATION" :key="location" :label="label" :value="location"></el-option>
                    </el-select>
                    <el-autocomplete v-if="param.location === 'header'" v-model="param.name" :fetch-suggestions="querySearch" class="inline-input" placeholder="参数名"></el-autocomplete>
                    <el-input v-else type="text" v-model="param.name" placeholder="参数名"></el-input>
                  </template>
                  <template slot="append">
                    <el-button v-if="index === form.params.length - 1" icon="plus" @click="handleNew"></el-button>
                    <el-button v-else icon="close" :disabled="!!param.required" @click="handleDelete(param)"></el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-form-item>
            <el-form-item>
              <el-button native-type="submit" type="primary" :disabled="disabled" :loading="disabled">发送请求</el-button>
            </el-form-item>
          </el-form>
          <div class="response">
            <el-tag type="gray"><i class="el-icon-warning"></i> 如为 JSONP 请求则只返回 JSON 部分数据</el-tag>
            <div ref="body" class="body"></div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-if="api && api.id" class="document-body" v-loading.body="!api" element-loading-text="加载中">
      <div class="body-inner">
        <div class="document-header">
          <i class="fa fa-align-justify" @click="withSummary = !withSummary"></i>
          <router-link :to="{ name: 'project-api-edit', params: { code: api.project.code, id: api.id } }" class="fa fa-pencil-square-o"> 编辑接口</router-link>
        </div>
        <div class="page-wrapper">
          <div class="page-inner">
            <section class="normal markdown-section">
              <h1>{{ api.name }}
                <el-tag type="primary">{{ statusMap[api.status] }}</el-tag>
              </h1>
              <p>{{ api.description }}</p>

              <h3>URL</h3>
              <el-tag type="gray"><el-http-method :method="api.method"></el-http-method>{{ api_url }}</el-tag>

              <template v-for="response in api.response">
                <h3 :class="'response-block response-block-'+response.type">
                  {{ response.description }}
                  <el-button class="pull-right" size="mini" @click="handleDebugger(response)"><i class="fa fa-bug"></i>调试</el-button>
                </h3>
                <el-table v-if="response.param.length" :data="response.param" :row-class-name="tableRowClassName">
                  <el-table-column prop="name" label="名称"></el-table-column>
                  <el-table-column prop="type" label="类型" inline-template>
                    <span>{{ row.type + (row.length ? '(' + row.length + ')' : '') }}</span>
                  </el-table-column>
                  <el-table-column prop="location" label="位置" inline-template>
                    <span>{{ PARAM_LOCATION[row.location] }}</span>
                  </el-table-column>
                  <el-table-column prop="default_value" label="默认值"></el-table-column>
                  <el-table-column prop="required" label="必需" inline-template>
                    <span>{{ (row.required ? '是' : '否') }}</span>
                  </el-table-column>
                  <el-table-column prop="description" label="描述"></el-table-column>
                </el-table>
                <pre><code :class="'lang-json' + (response.jsonp_callback ? 'p' : '')" v-html="formattedBody(response)"></code></pre>
              </template>

              <h3>状态码</h3>
              <el-table v-if="errors.length" :data="errors">
                <el-table-column prop="code" label="状态码" inline-template>
                  <span>{{ row.name ? row.name + '('+ row.code +')' : row.code }}</span>
                </el-table-column>
                <el-table-column prop="description" label="状态描述"></el-table-column>
              </el-table>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
  import ace from 'brace'
  import 'brace/mode/json'
  import 'brace/theme/tomorrow'
  import { mapGetters, mapActions } from 'vuex'
  import {
    HTTP_HEADERS,
    HTTP_METHOD,
    FORM_ENCTYPE,
    PARAM_LOCATION,
    MOCK_URL,
    PROXY_URL
} from '../../config'
  import ElHttpMethod from '../../components/http-method.vue'
  import ElNodata from '../../components/nodata.vue'
  import { jsonFormat } from '../../utils'
  import Mock from 'mockjs'

  export default{
    components: {
      ElHttpMethod,
      ElNodata
    },
    data() {
      return {
        withSummary: true,
        withDebugger: false,
        statusMap: {
          '0': '开发中',
          '1': '使用中'
        },
        uuid: 0,
        result: false,
        HTTP_HEADERS,
        HTTP_METHOD,
        FORM_ENCTYPE,
        PARAM_LOCATION,
        MOCK_URL,
        PROXY_URL,
        keyword: '',
        disabled: false,
        response: {},
        form: {
          method: '',
          enctype: '',
          url: '',
          type: '',
          params: []
        },
        rules: {
          url: [
            { required: true, message: '请输入请求接口地址', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'session',
        'project',
        'api',
        'modules',
        'fields',
        'errors',
        'debugs'
      ]),
      api_url() {
        return this.api.project.base_url + this.api.path
      },
      params () {
        let params = {}

        this.form.params.forEach(param => {
          if (!params.hasOwnProperty(param.location)) {
            params[param.location] = {}
          }

          params[param.location][param.name] = param.default_value
        })

        return params
      },
      paths () {
        let paths = ''

        if (this.params.path) {
          for (let p in this.params.path) {
            paths += p + '/' + this.params.path[p]
          }
        }

        if (paths) {
          paths = (this.api.path.lastIndexOf('/') !== this.api.path.length - 1 ? '/' : '' ) + paths
        }

        return paths
      },
      querys () {
        let querys = ''


        if (this.params.query) {
          for (let q in this.params.query) {
            querys += '&' + q + '=' + this.params.query[q]
          }
        }

        if (querys) {
          querys = querys.substring(1)
          querys = (this.api.path.indexOf('?') === -1 ? '?' : '&') + querys
        }

        return querys
      },
      url () {
        return this.api_url + this.paths
      },
      wrapClass() {
        return [
          'document',
          {
            'with-summary': this.withSummary,
            'with-debugger': this.withDebugger,
          }
        ]
      }
    },
    beforeRouteEnter(to, from, next) {
      next(async(vm) => {
        vm.withDebugger = false
        await vm.loadData()
      })
    },
    watch: {
      $route (to, from) {
        if (to.name === from.name) {
          this.loadData()
        }
      }
    },
    methods: {
      ...mapActions([
        'fetchModules',
        'fetchApi',
        'fetchFields',
        'fetchErrors',
        'fetchDebugs',
        'createDebug',
        'deleteDebug'
      ]),
      handleNew() {
        this.uuid++
        this.newParam()
      },
      handleDelete(param) {
        this.form.params.forEach((item, index) => {
          if (item.id === param.id) {
            this.form.params.splice(index, 1)
          }
        })
      },
      handleSubmit() {
        this.$refs.form.validate(async(valid) => {
          if (valid) {
            let params = {}
            let url = this.form.url
            let method = this.form.method.toLowerCase()
            let options = {}
            let body
            let data

            if (this.response.jsonp_callback) {
              method = 'jsonp'
              options = { 'jsonp': this.response.jsonp_callback }
            }

            this.form.params.forEach(param => {
              params[param.name] = param.default_value
            })

            this.disabled = true

            data = params

            if (this.form.type === 'mock') {
              url = MOCK_URL + this.response.id
            } else if (this.form.type === 'proxy') {
              data = { ...this.form }
              data.params = this.params
              method = 'post'
              url = PROXY_URL
            }

            await this.$http[method](url, data, options).then(async(response) => {
              body = JSON.stringify(response.body, null, 2)
              await this.createDebug({ data: JSON.stringify(this.form) })
              this.renderEditor(body)
            }).catch(error => {
              console.log(error)
            })

            this.disabled = false
          } else {
            return false
          }
        })
      },
      handleDebugger(response) {
        this.withDebugger = !this.withDebugger

        if (this.withDebugger) {
          this.response = response

          if (response.param.length > 0) {
            this.form.params = JSON.parse(JSON.stringify(response.param))
          } else {
            this.form.params = []
            this.newParam()
          }

          this.form.url = this.api_url
          this.form.method = this.api.method
          this.form.enctype = this.api.project.enctype

          this.fetchDebugs();
        }
      },
      handleDebugClick(debug) {
        this.form = JSON.parse(debug.data)
      },
      handleDebugDelete(debug) {
        this.deleteDebug(debug)
      },
      querySearch(queryString, cb) {
        let headers = []
        HTTP_HEADERS.forEach(header => {
          headers.push({ value: header })
        })
        let results = queryString ? headers.filter(this.createFilter(queryString)) : headers
        cb(results)
      },
      createFilter(queryString) {
        return (header) => {
          return (header.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      newParam () {
        this.form.params.push({
          id: this.uuid,
          description: '',
          default_value: '',
          location: 'query',
          name: ''
        })
      },
      parseDebugData(debug) {
        return JSON.parse(debug.data)
      },
      renderEditor(body) {
        let editor = ace.edit(this.$refs.body)

        editor.$blockScrolling = Infinity
        editor.getSession().setMode('ace/mode/json')
        editor.getSession().setTabSize(2)
        editor.setTheme('ace/theme/tomorrow')
        editor.setOptions({ maxLines: Infinity })
        editor.setShowPrintMargin(false)
        editor.setReadOnly(true)
        editor.setValue(body)
        editor.clearSelection()
      },
      async loadData() {
        let id = this.$route.params.id

        await this.fetchApi({ id })
        await this.fetchModules({ project_id: this.api.project_id })
        await this.fetchFields({ project_id: this.api.project_id })
        await this.fetchErrors({ project_id: this.api.project_id, api_id: this.api.id })
      },
      formattedBody (response) {
        let body = response.body

        body = JSON.parse(body)

        if (response.is_mockjs) {
          body = Mock.mock(body)
        }

        return jsonFormat(body, this.fields, response.jsonp_callback)
      },
      tableRowClassName(row, index) {
        if (row.required) {
          return 'row-required'
        }

        return ''
      }
    }
  }
</script>
<style lang="scss" scoped>
  h1 {
    .el-tag {
      margin-left: 5px;
      vertical-align: 7px;
    }
  }
  .el-tag--gray {
    padding: 0 10px;
    background-color: #f7f7f7;
    border-color: #f7f7f7;
    font-size: 14px;
  }
  .document-debugger {
    .el-row {
      padding: 20px;
    }

    .el-col:nth-child(1) {
      padding-top: 5px;

      h3 {
        font-weight: normal;
        font-size: 14px;
        color: rgb(72, 87, 106);
      }
    }

    .el-col:nth-child(2) {
      padding-left: 20px;
    }

    .el-form {
      padding: 0;
    }
  }
  .debugs {
    margin-top: 10px;
    font-size: 14px;
  }
  .debug {
    position: relative;
    line-height: 24px;
    padding: 0 10px;
    margin-bottom: 5px;
    overflow: hidden;
    background-color: #fafafa;
    border-radius: 5px;

    &:hover {
      background-color: #f3f3f3;
      cursor: pointer;

      .fa-close {
        display: block;
        position: absolute;
        top: 50%;
        right: 8px;
        transform: translateY(-50%);
        color: rgb(131, 145, 165);
      }
    }

    .fa-close {
      display: none;

      &:hover {
        color: #000;
      }
    }
  }
  .el-table {
    border-width: 1px;

    + pre {
      margin-top: 20px;
    }
  }
  .response-block {
    position: relative;

    .el-button {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
    }
  }
  .response {
    .el-tag {
      display: block;
      margin-bottom: 10px;
      font-size: 12px;
      color: #666;
    }

    .body {
      border-radius: 4px;
    }
  }
</style>
<style lang="scss">
  .document {
    position: relative;
    width: 100%;
    height: 1280px;
    font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
    overflow: hidden;

    &.with-summary {
      .document-summary {
        left: 0
      }
      .document-body {
        left: 300px
      }
    }
    &.with-debugger {
      .document-debugger {
        right: 0;
      }
    }
  }
  .document-search-input {
    position: relative;
    padding: 6px;
    background: 0 0;
    transition: top .5s ease;
    background: #fff;
    border-bottom: 1px solid rgba(0, 0, 0, .07);
    border-top: 1px solid rgba(0, 0, 0, .07);
    margin-bottom: 10px;
    margin-top: -1px;
    background-color: #fafafa;

    .fa {
      position: absolute;
      top: 50%;
      left: 15px;
      margin: 0;
      color: #ccc;
      transform: translateY(-55%);
    }

    input {
      &, &:focus, &:hover {
        width: 100%;
        background: 0 0;
        border: 1px solid transparent;
        box-shadow: none;
        outline: 0;
        line-height: 22px;
        padding: 7px 7px 7px 30px;
        color: inherit;
        font-size: 100%;
      }
    }
  }
  .document-summary {
    position: absolute;
    top: 0;
    left: -300px;
    bottom: 0;
    z-index: 1;
    overflow-y: auto;
    width: 300px;
    color: #364149;
    border-right: 1px solid rgba(0, 0, 0, .07);
    transition: left 250ms ease;

    .summary {
      transition: top .5s ease;

      li {
        list-style: none;

        &.divider {
          height: 1px;
          margin: 7px 0;
          overflow: hidden;
          background: rgba(0, 0, 0, .07)
        }

        a { font-size: 14px; }

        a, .module-name {
          display: block;
          padding: 6px 15px;
          color: #364149;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .module-name {
          color: #7f8c8d;
          opacity: 0.6;
          cursor: not-allowed;
        }

        .el-tag {
          height: 20px;
          line-height: 18px;
          vertical-align: middle;
        }

        &.active > a {
          color: #20a0ff;
        }
      }
    }
  }
  .document-debugger {
    position: fixed;
    top: 61px;
    right: -100%;
    width: 100%;
    height: 100%;
    padding-bottom: 60px;
    z-index: 10;
    overflow-y: auto;
    color: #364149;
    transition: all .3s ease;
    background-color: #fff;

    .page-header {
      padding: 20px;

      .el-icon-close {
        position: absolute;
        top: 25px;
        right: 20px;
        margin-right:0;
        color: #ccc;
        font-size: 20px;
        cursor: pointer;

        &:hover {
          color: #000;
        }
      }
    }

    .el-nodata {
      display: inline-block;
      padding: 20px 0;
      font-size: 12px;

      .fa {
        font-size: 50px;
      }
    }

    .el-input-group {
      width: 100%;
    }

    .el-form-item {
      margin-bottom: 10px;
    }

    .el-input-group__prepend {
      width: 50%;
      padding: 0;

      > .el-select, > .el-input, > .el-autocomplete {
        display: inline-block;
      }

      > .el-select {
        width: 55%;
        margin: -10px 0;
      }

      > .el-input, > .el-autocomplete {
        width: 45%;

        &, .el-input__inner {
          height: 34px;
        }

        .el-input__inner {
          &, &:hover, &:active {
            border-color: #fff #fff #fff #c0ccda;
          }
        }
      }
    }

    .el-input-group {
      .el-button.is-disabled {
        &, &:hover, &:focus {
          background-color: transparent;
          border-color: transparent;
          opacity: .3;
        }
      }

      .el-input__inner {
        position: relative;
        z-index: 2;
      }
    }
  }
  .document-header {
    position: relative;
    height: 50px;
    line-height: 50px;
    color: #7e888b;

    .fa {
      padding-left: 20px;
      margin: 0;
      color: #ccc;
      font-size: 14px;
      cursor: pointer;

      &:hover {
        color: #444;
      }
    }
  }
  .document-body {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    overflow-y: auto;
    color: #000;
    background: #fff;
    transition: left 250ms ease;

    .body-inner {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      overflow-y: auto
    }
  }
  .page-wrapper {
    position: relative;
    outline: 0
  }
  .page-inner {
    position: relative;
    width: 90%;
    margin: 0 auto;
    padding: 20px 0 100px;

    .normal {
      pre, code {
        color: #666;

        .hljs-jsonp {
          color: #20a0ff;
          font-weight: bold;
        }
        .hljs-comment,
        .hljs-title {
          color: #bbb;
        }
        .hljs-variable,
        .hljs-attribute,
        .hljs-tag,
        .hljs-regexp,
        .hljs-deletion,
        .ruby .hljs-constant,
        .xml .hljs-tag .hljs-title,
        .xml .hljs-pi,
        .xml .hljs-doctype,
        .html .hljs-doctype,
        .css .hljs-id,
        .css .hljs-class,
        .css .hljs-pseudo {
          color: #c82829;
        }
        .hljs-number,
        .hljs-preprocessor,
        .hljs-pragma,
        .hljs-built_in,
        .hljs-literal,
        .hljs-params,
        .hljs-constant {
          color: #ff4949;
        }
        .ruby .hljs-class .hljs-title,
        .css .hljs-rules .hljs-attribute {
          color: #eab700;
        }
        .hljs-string,
        .hljs-value,
        .hljs-inheritance,
        .hljs-header,
        .hljs-addition,
        .ruby .hljs-symbol,
        .xml .hljs-cdata {
          color: #718c00;
        }
        .css .hljs-hexcolor {
          color: #3e999f;
        }
        .hljs-function,
        .python .hljs-decorator,
        .python .hljs-title,
        .ruby .hljs-function .hljs-title,
        .ruby .hljs-title .hljs-keyword,
        .perl .hljs-sub,
        .javascript .hljs-title,
        .coffeescript .hljs-title {
          color: #4271ae;
        }
        .hljs-keyword,
        .javascript .hljs-function {
          color: #8959a8;
        }
        .hljs {
          display: block;
          background: white;
          color: #4d4d4c;
          padding: 0.5em;
        }
        .coffeescript .javascript,
        .javascript .xml,
        .tex .hljs-formula,
        .xml .javascript,
        .xml .vbscript,
        .xml .css,
        .xml .hljs-cdata {
          opacity: 0.5;
        }
      }
    }
  }
  .markdown-section {
    display: block;
    word-wrap: break-word;
    overflow: hidden;
    color: #333;
    line-height: 1.7;
    text-size-adjust: 100%;

    > :first-child {
      margin-top: 0 !important
    }

    > :last-child {
      margin-bottom: 0 !important
    }

    blockquote, code, figure, img, pre, table, tr {
      page-break-inside: avoid
    }
    h2, h3, h4, h5, p {
      orphans: 3;
      widows: 3
    }
    h1, h2, h3, h4, h5 {
      page-break-after: avoid
    }
    b, strong {
      font-weight: 700
    }
    em {
      font-style: italic
    }
    blockquote, dl, ol, p, ul {
      margin-top: 0;
      margin-bottom: .85em
    }
    a {
      color: #4183c4;
      text-decoration: none;
      background: 0 0
    }
    a:active, a:focus, a:hover {
      outline: 0;
      text-decoration: underline
    }
    img {
      border: 0;
      max-width: 100%
    }
    hr {
      height: 4px;
      padding: 0;
      margin: 1.7em 0;
      overflow: hidden;
      background-color: #e7e7e7;
      border: none
    }
    hr:after, hr:before {
      display: table;
      content: " "
    }
    hr:after {
      clear: both
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1.275em;
      margin-bottom: .85em;
      font-weight: 700
    }
    h1 {
      font-size: 2em
    }
    h2 {
      font-size: 1.75em
    }
    h3 {
      font-size: 1.5em
    }
    h4 {
      font-size: 1.25em
    }
    h5 {
      font-size: 1em
    }
    h6 {
      font-size: 1em;
      color: #777
    }
    code, pre {
      font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;
      direction: ltr;
      margin: 0;
      padding: 0;
      border: none;
      color: inherit
    }
    pre {
      overflow: auto;
      word-wrap: normal;
      margin: 0;
      padding: .85em 1em;
      margin-bottom: 1.275em;
      background: #f7f7f7
    }
    pre > code {
      display: inline;
      max-width: initial;
      padding: 0;
      margin: 0;
      overflow: initial;
      line-height: inherit;
      font-size: .85em;
      white-space: pre;
      background: 0 0
    }
    pre > code:after, pre > code:before {
      content: normal
    }
    code {
      padding: .2em .5em;
      margin: 0;
      font-size: .85em;
      background-color: #f7f7f7
    }
    code:after, code:before {
      letter-spacing: -.2em;
      content: "\00a0"
    }

    ol, ul {
      padding: 0;
      margin: 0;
      margin-bottom: .85em;
      padding-left: 2em
    }
    ol ol, ol ul, ul ol, ul ul {
      margin-top: 0;
      margin-bottom: 0
    }
    ol ol {
      list-style-type: lower-roman
    }
    blockquote {
      margin: 0;
      margin-bottom: .85em;
      padding: 0 15px;
      color: #858585;
      border-left: 4px solid #e5e5e5
    }
    blockquote:first-child {
      margin-top: 0
    }
    blockquote:last-child {
      margin-bottom: 0
    }
    dl {
      padding: 0
    }
    dl dt {
      padding: 0;
      margin-top: .85em;
      font-style: italic;
      font-weight: 700
    }
    dl dd {
      padding: 0 .85em;
      margin-bottom: .85em
    }
    dd {
      margin-left: 0
    }
    h1,
    h2,
    h3,
    h4,
    strong {
      font-weight: 600;
      color: #2c3e50;
    }
    p,
    ul,
    ol {
      word-spacing: 0.05em;
    }
    em {
      color: #7f8c8d;
    }
    pre {
      padding: 1em;
      line-height: 1.5em;
      margin: 0;
    }
    code span.css,
    code span.javascript,
    code span.html,
    span[class^="hljs-"] {
      -webkit-font-smoothing: initial;
      -moz-osx-font-smoothing: initial;
    }

    pre > code {
      font-size: 0.8em;
      display: block;
    }

    code:after, code:before {
      content: none;
      letter-spacing: 0.05em;
    }

    h1 {
      margin: 0 0 1em;
    }
    h2 {
      margin: 45px 0 0.8em;
      padding-bottom: 0.7em;
      border-bottom: 1px solid #ddd;
    }
    h3 {
      margin: 30px 0 20px;
    }
    figure,
    p,
    ul,
    ol {
      margin: 1.2em 0;
    }
    p,
    ul,
    ol {
      line-height: 1.6em;
    }
    ul,
    ol {
      padding-left: 1.5em;
    }
    a {
      color: #42b983;
      font-weight: 600;
    }
    blockquote {
      margin: 2em 0;
      padding-left: 20px;
      border-left: 4px solid #42b983;
    }
    blockquote p {
      font-weight: 600;
      margin-left: 0;
    }
    iframe {
      margin: 1em 0;
    }

    pre code {
      position: relative;

      &.lang-html:after,
      &.lang-js:after,
      &.lang-json:after,
      &.lang-jsonp:after,
      &.lang-bash:after,
      &.lang-css:after {
        position: absolute;
        top: 0;
        right: 0;
        color: #ccc;
        text-align: right;
        font-size: 1em;
        line-height: 15px;
        height: 15px;
        font-weight: 600;
      }
      &.lang-html:after {
        content: 'HTML';
      }
      &.lang-js:after {
        content: 'JS';
      }
      &.lang-json:after {
        content: 'JSON';
      }
      &.lang-jsonp:after {
        content: 'JSONP';
      }
      &.lang-bash:after {
        content: 'Shell';
      }
      &.lang-css:after {
        content: 'CSS';
      }
    }
  }
  .el-table {
    tr {
      color: #7f8c8d;
    }
    .row-required {
      color: #000;
    }
  }
</style>
