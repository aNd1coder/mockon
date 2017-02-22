<template>
  <div :class="wrapClass">
    <div class="document-summary">
      <div class="document-search-input">
        <i class="fa fa-search"></i>
        <input type="text" placeholder="输入关键字搜索...">
      </div>
      <ul v-if="modules.length > 0" class="summary">
        <li v-for="module in modules">
          <span>{{ module.name }}</span>
          <ul v-if="module.api.length > 0">
            <li v-for="ma in module.api" :class="{ 'active': ma.id === api.id }">
              <router-link :to="{ name: 'document-view', params: { id: ma.id } }">{{ ma.name }}</router-link>
            </li>
          </ul>
        </li>
        <li class="divider"></li>
        <li>
          <router-link :to="{ name: 'project' }">状态码</router-link>
        </li>
      </ul>
    </div>
    <div class="document-debugger">
      <h1 class="page-header">
        接口调试
        <i class="el-icon-close" @click="withDebugger = false"></i>
      </h1>
      <el-form :model="form" :rules="rules" ref="form" @submit.native.prevent="handleSubmit">
        <el-form-item prop="method">
          <el-select v-model="form.method" placeholder="请求方法">
            <el-option v-for="method in HTTP_METHOD" :label="method" :value="method"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="enctype">
          <el-select v-model="form.enctype" placeholder="编码类型">
            <el-option v-for="enctype in FORM_ENCTYPE" :label="enctype" :value="enctype"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="url">
          <el-input type="text" v-model="form.url" placeholder="接口地址"></el-input>
        </el-form-item>
        <el-form-item v-for="(param, index) in form.params">
          <el-input type="text" v-model="param.default_value" placeholder="参数值">
            <template slot="prepend">
              <el-select v-model="param.location" placeholder="参数位置">
                <el-option v-for="(label, location) in PARAM_LOCATION" :label="label" :value="location"></el-option>
              </el-select><el-autocomplete
                v-if="param.location === 'header'"
                v-model="param.name"
                :fetch-suggestions="querySearch"
                class="inline-input"
                placeholder="参数名"
            ></el-autocomplete><el-input v-else type="text" v-model="param.name" placeholder="参数名"></el-input>
            </template><template slot="append">
              <el-button v-if="index === form.params.length - 1" icon="plus" @click="handleNew"></el-button>
              <el-button v-else icon="close" :disabled="!!param.required" @click="handleRemove(param)"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button native-type="submit" type="primary" :disabled="disabled" :loading="disabled">发送请求</el-button>
        </el-form-item>
      </el-form>
      <div class="response">
        <div class="status"></div>
        <div ref="body" class="body"></div>
      </div>
    </div>
    <div v-if="api && api.id" class="document-body">
      <div class="body-inner">
        <div class="document-header">
          <i class="fa fa-align-justify" @click="withSummary = !withSummary"></i>
          {{ api.project.name }}<i class="fa fa-angle-right"></i>{{ api.module.name }}
          <el-button type="info" size="mini" @click="handleDebugger"><i class="fa fa-bug"></i>调试接口</el-button>
        </div>
        <div class="page-wrapper">
          <div class="page-inner">
            <section class="normal markdown-section">
              <h1>{{ api.name }}
                <el-tag type="primary">{{ statusMap[api.status] }}</el-tag>
              </h1>
              <p>{{ api.description }}</p>
              <h3>URL</h3>
              <el-http-method :method="api.method"></el-http-method>
              <code>{{ api.project.base_url + api.path }}</code>

              <template v-for="response in api.response">
                <h3 :class="response.type">{{ response.description }}</h3>
                <el-table v-if="response.param.length" :data="response.param" :row-class-name="tableRowClassName">
                  <el-table-column prop="name" label="名称"></el-table-column>
                  <el-table-column prop="type" label="类型" inline-template>
                    <span>{{ row.type + (row.length ? '(' + row.length + ')' : '') }}</span>
                  </el-table-column>
                  <el-table-column prop="location" label="位置"></el-table-column>
                  <el-table-column prop="default_value" label="默认值"></el-table-column>
                  <el-table-column prop="description" width="350" label="描述"></el-table-column>
                </el-table>
                <pre><code class="lang-json" v-html="formattedBody(response.body)"></code></pre>
              </template>
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
    PARAM_LOCATION
} from '../../config'
  import ElHttpMethod from '../../components/http-method.vue'
  import { jsonFormat } from '../../utils'

  export default{
    components: { ElHttpMethod },
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
        disabled: false,
        form: {
          method: '',
          enctype: '',
          url: '',
          params: {}
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
        'user',
        'project',
        'api',
        'modules',
        'fields'
      ]),
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
        vm.form.method = vm.api.method
        vm.form.enctype = vm.api.project.enctype
        vm.form.url = vm.api.project.base_url + vm.api.path
        if (vm.api.response.length > 0) {
          let params = vm.api.response[0].param

          if (params.length > 0) {
            vm.form.params = JSON.parse(JSON.stringify(params))
          } else {
            vm.form.params = []
            vm.newParam()
          }
        }
      })
    },
    watch: {
      '$route': 'loadData'
    },
    methods: {
      ...mapActions([
        'fetchModules',
        'fetchApi',
        'fetchFields'
      ]),
      handleNew() {
        this.uuid++
        this.newParam()
      },
      handleRemove(param) {
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

            this.form.params.forEach(param => {
              params[param.name] = param.default_value
            })

            this.disabled = true

            //enctype: this.form.enctype,
            let result = await this.$http[this.form.method](this.form.url, params)
            console.log(result)
            let value = JSON.stringify(result.body.data, null, 2)
            let editor = ace.edit(this.$refs.body)

            editor.$blockScrolling = Infinity
            editor.getSession().setMode('ace/mode/json')
            editor.getSession().setTabSize(2)
            editor.setTheme('ace/theme/tomorrow')
            editor.setOptions({ maxLines: Infinity })
            editor.setShowPrintMargin(false)
            editor.setReadOnly(true)
            editor.setValue(value)
            editor.clearSelection()

            this.disabled = false
          } else {
            return false
          }
        })
      },
      handleDebugger() {
        this.withDebugger = !this.withDebugger
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
          location: 'formData',
          name: ''
        })
      },
      async loadData() {
        let id = this.$route.params.id

        await this.fetchApi({ id })
        await this.fetchModules({ project_id: this.api.project_id })
        await this.fetchFields({ project_id: this.api.project_id })
      },
      formattedBody (body) {
        body = JSON.parse(body)
        return jsonFormat(body, this.fields)
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
  .el-tag {
    margin-right: 5px;
  }
  .el-table {
    border-width: 1px;

    + pre {
      margin-top: 20px;
    }
  }
</style>
<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Roboto+Mono|Source+Sans+Pro:300,400,600');
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

        a, span {
          display: block;
          padding: 8px 15px;
          color: #364149;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        span {
          color: #7f8c8d;
          opacity: 0.6;
          cursor: not-allowed;
        }

        a {
          font-size: 14px;
        }

        &.active > a {
          color: #42b983;
        }

        ul {
          padding-left: 20px
        }
      }
    }
  }
  .document-debugger {
    position: absolute;
    top: 0;
    right: -100%;
    width: 100%;
    height: 100%;
    bottom: 0;
    z-index: 10;
    overflow-y: auto;
    color: #364149;
    transition: all .3s ease;
    background-color: #fff;

    .page-header {
      padding: 20px 30px;

      .el-icon-close {
        position: absolute;
        top: 25px;
        right: 30px;
        margin-right:0;
        color: #ccc;
        font-size: 20px;
        cursor: pointer;

        &:hover {
          color: #000;
        }
      }
    }

    .el-input-group {
      width: 100%;
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
          height: 38px;
        }

        .el-input__inner {
          &, &:hover, &:active {
            border-color: #fff #fff #fff #c0ccda;
          }
        }
      }
    }

    .el-input-group__append {
      .el-button.is-disabled, .el-button.is-disabled:hover, .el-button.is-disabled:focus {
        background-color: transparent;
        border-color: transparent;
        opacity: .3;
      }
    }

    .response {
      margin: 0 30px;
    }
  }
  .document-header {
    position: relative;
    height: 50px;
    line-height: 50px;
    color: #7e888b;

    .fa {
      padding: 0 15px;
      margin: 0;
      color: #ccc;
      font-size: 14px;
    }

    .fa-align-justify {
      cursor: pointer;

      &:hover {
        color: #444;
      }
    }

    .fa-angle-right {
      font-size: 20px;
    }

    .el-button {
      position: absolute;
      top: 15px;
      right: 15px;

      .fa {
        height: auto;
        line-height: 1em;
        padding: 0;
        color: #fff;
        margin-right: 3px;
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
        .hljs-comment,
        .hljs-title {
          color: #8e908c;
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
          color: #f5871f;
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
      &.lang-bash:after,
      &.lang-css:after {
        position: absolute;
        top: 0;
        right: 0;
        color: #ccc;
        text-align: right;
        font-size: 0.75em;
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
      &.lang-bash:after {
        content: 'Shell';
      }
      &.lang-css:after {
        content: 'CSS';
      }
    }
  }
  .el-table .row-required {
    .el-table_1_column_1 {
      color: #20a0ff;
    }
  }
</style>
