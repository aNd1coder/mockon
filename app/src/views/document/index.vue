<template>
  <div :class="wrapClass" v-loading.fullscreen.lock="loading">
    <div class="document-summary">
      <div class="document-search-input">
        <i class="fa fa-search"></i>
        <el-tooltip class="item" effect="dark" content="可按接口名称、URL、请求方式搜索" placement="right">
          <input type="text" v-model="search" placeholder="关键词...">
        </el-tooltip>
      </div>
      <ul v-if="modules.length > 0" class="summary">
        <li v-for="module in modules" :key="module.id">
          <span class="module-name">{{ module.name }}</span>
          <ul v-if="module.api.length > 0">
            <li v-for="ma in module.api" v-if="filterApi(ma)" :key="ma.id" :class="{ 'active': ma.id === api.id }">
              <router-link :to="{ name: 'document-view', params: { id: base64Encode(ma.id) } }">
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
          <h3>调试记录</h3>
          <el-tooltip class="item" effect="dark" content="可按接口地址、请求方法、请求方式搜索" placement="top">
            <el-input v-model="keyword" placeholder="关键词..." icon="search"></el-input>
          </el-tooltip>
          <ul v-if="filteredDebugs.length > 0" class="debugs">
            <li v-for="debug in filteredDebugs"
                class="debug" @click="handleDebugClick(debug)">
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
            <el-tag v-if="form.type === 'mock'" type="primary">Mock 数据地址：<a :href="mockUrl" target="_blank">{{ mockUrl }}</a></el-tag>
            <el-form-item label="请求参数">
              <el-form-item v-for="(param, index) in form.params" :key="param.id">
                <el-input type="text" v-model="param.default_value" placeholder="参数值">
                  <template slot="prepend">
                    <el-checkbox v-model="param.checked"></el-checkbox>
                    <el-select v-model="param.location" placeholder="参数位置">
                      <el-option v-for="(label, location) in PARAM_LOCATION" :key="location" :label="label" :value="location"></el-option>
                    </el-select>
                    <el-autocomplete v-if="param.location === 'header'" v-model="param.name" :fetch-suggestions="querySearch" class="inline-input" placeholder="参数名"></el-autocomplete>
                    <el-input v-else type="text" v-model="param.name" placeholder="参数名"></el-input>
                  </template>
                  <template slot="append">
                    <el-button v-if="index === form.params.length - 1" icon="plus" @click="newParam"></el-button>
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
            <el-tag type="danger"><i class="el-icon-warning"></i> 如为 JSONP 请求只返回 JSON 数据部分</el-tag>
            <div v-if="body" ref="body" class="body"></div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="document-body">
      <div v-if="api && api.id" class="body-inner">
        <div class="document-header">
          <i class="fa fa-align-justify" @click="withSummary = !withSummary"></i>
          <router-link :to="{ name: 'project-api-edit', params: { code: api.project.code, id: base64Encode(api.id) } }" class="fa fa-pencil-square-o"> 编辑接口</router-link>
        </div>
        <div class="page-wrapper">
          <div class="page-inner">
            <section class="normal markdown-section">
              <h1>{{ api.name }}<el-tag type="gray">{{ statusMap[api.status] }}</el-tag></h1>
              <div class="page-meta">
                <el-user-block :user="api.user" :size="20"></el-user-block>
                {{ api.modified_at | dateformat }}编辑过该接口文档
              </div>
              <blockquote v-html="marked(api.description)"></blockquote>
              <template v-if="api.developer">
                <h3>接口负责人</h3>
                <p>{{ api.developer }}</p>
              </template>
              <h3>请求 URL</h3>
              <el-tag type="gray"><el-http-method :method="api.method"></el-http-method>{{ api.url }}</el-tag>

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
                  <el-table-column prop="description" label="描述" inline-template>
                    <div v-html="marked(row.description)"></div>
                  </el-table-column>
                </el-table>
                <pre :ref="'codeview'+response.id" class="code-view"><code :class="'lang-json' + (response.jsonp_callback ? 'p' : '')" v-html="formattedBody(response)"></code><el-button size="small" @click="handleCollapse(response.id)">折叠</el-button></pre>
              </template>
              <template v-if="errors.length">
                <h3>状态码</h3>
                <el-table :data="errors">
                  <el-table-column prop="code" label="状态码" inline-template>
                    <span>{{ row.name ? row.name + '(' + row.code + ')' : row.code }}</span>
                  </el-table-column>
                  <el-table-column prop="description" label="状态描述"></el-table-column>
                </el-table>
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
    PARAM_LOCATION,
    MOCK_URL,
    PROXY_URL
} from '../../config'
  import ElHttpMethod from '../../components/http-method.vue'
  import ElUserBlock from '../../components/user-block.vue'
  import ElNodata from '../../components/nodata.vue'
  import {
    jsonFormat,
    base64Encode,
    base64Decode,
    marked
  } from '../../utils'
  import Mock from 'mockjs'

  export default{
    components: {
      ElHttpMethod,
      ElUserBlock,
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
        marked,
        base64Encode,
        search: '',
        keyword: '',
        body: '',
        loading: true,
        disabled: false,
        response: {},
        form: {
          method: '',
          enctype: '',
          url: '',
          type: '',
          checked: false,
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
      params () {
        let params = {}

        this.form.params.forEach(param => {
          if (param.checked) {
            if (!params.hasOwnProperty(param.location)) {
              params[param.location] = {}
            }

            params[param.location][param.name] = param.default_value
          }
        })

        return params
      },
      mockUrl() {
        return MOCK_URL + base64Encode(this.response.id)
      },
      wrapClass() {
        return [
          'document',
          {
            'with-summary': this.withSummary,
            'with-debugger': this.withDebugger,
          }
        ]
      },
      filteredDebugs() {
        return this.debugs.filter(debug => {
          let d = this.parseDebugData(debug)
          let fields = ['method', 'url', 'type']
          let match = false

          for (let field of fields) {
            if (d[field].toLowerCase().indexOf(this.keyword.toLowerCase()) !== -1) {
              match = true
            }
          }

          return match
        })
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
          this.loadData(true)
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
            let jsonp_callback = this.form.jsonp_callback
            let data

            this.form.params.forEach(param => {
              if (param.checked) {
                params[param.name] = param.default_value
              }
            })

            this.disabled = true

            data = params

            // JSONP 请求
            if (jsonp_callback) {
              data = { params: { ...params, callback: jsonp_callback } }
              method = 'jsonp'
            }

            if (this.form.type === 'mock') {
              url = MOCK_URL + this.response.id
              method = 'post'
            } else if (this.form.type === 'proxy') {
              data = { ...this.form }
              data.params = this.params
              method = 'post'
              url = PROXY_URL
            } else {
              data = {
                body: this.params.body,
                headers: this.params.header,
                params: this.params.query
              }
            }

            this.body = false

            await this.$http[method](url, data).then(async (response) => {
              let body

              if (response.body) {
                body = response.body
              } else {
                body = eval('(' + response.bodyText + ')') // 兼容 key 没加引号
              }

              this.body = JSON.stringify(body, null, 2)
              await this.createDebug({ data: JSON.stringify(this.form) })
              this.renderEditor()
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
        let params

        this.withDebugger = !this.withDebugger

        if (this.withDebugger) {
          this.response = response

          if (response.param.length > 0) {
            params = JSON.parse(JSON.stringify(response.param))

            this.form.params = params.map(param => {
              param.checked = !!param.required
              return param
            })
          } else {
            this.form.params = []
          }

          this.newParam()

          this.form.url = this.api.url
          this.form.method = this.api.method
          this.form.enctype = this.api.project.enctype
          this.form.jsonp_callback = this.response.jsonp_callback

          this.fetchDebugs()
        }
      },
      handleDebugClick(debug) {
        this.body = false
        this.form = JSON.parse(debug.data)
      },
      handleDebugDelete(debug) {
        this.deleteDebug(debug)
      },
      handleCollapse(refId) {
        let codeView = this.$refs['codeview' + refId]

        if (codeView && codeView.length > 0) {
          codeView = codeView[0]

          if (codeView.classList.contains('collapse')) {
            codeView.classList.remove('collapse')
          } else {
            codeView.classList.add('collapse')
          }
        }
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
          name: '',
          checked: false
        })

        this.uuid++
      },
      parseDebugData(debug) {
        return JSON.parse(debug.data)
      },
      renderEditor() {
        let editor = ace.edit(this.$refs.body)

        editor.$blockScrolling = Infinity
        editor.getSession().setMode('ace/mode/json')
        editor.getSession().setTabSize(2)
        editor.setTheme('ace/theme/tomorrow')
        editor.setOptions({ maxLines: Infinity })
        editor.setShowPrintMargin(false)
        editor.setReadOnly(true)
        editor.setValue(this.body)
        editor.clearSelection()
      },
      async loadData(reload) {
        let id = base64Decode(this.$route.params.id)

        this.loading = true

        await this.fetchApi({ id })

        if (reload) {
          this.loading = false
        }

        await this.fetchFields({ project_id: this.api.project_id })
        await this.fetchErrors({ project_id: this.api.project_id, api_id: this.api.id })

        if (!reload) {
          await this.fetchModules({ project_id: this.api.project_id })

          this.loading = false
        }
      },
      formattedBody (response) {
        let body = response.body || {}

        body = JSON.parse(body)

        if (response.is_mockjs) {
          body = Mock.mock(body)
        }

        return jsonFormat(body, this.fields, response.jsonp_callback)
      },
      filterApi(api) {
        let fields = ['name', 'url', 'method']
        let match = false

        for (let field of fields) {
          if (api[field].toLowerCase().indexOf(this.search.toLowerCase()) !== -1) {
            match = true
          }
        }

        return match
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
    background-color: #f6f8fa;
    border-color: #f6f8fa;
    font-size: 14px;
  }
  .document-debugger {
    .el-row {
      padding: 20px;
    }

    .el-col:nth-child(1) {
      padding-top: 5px;

      h3 {
        margin: 6px 0;
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
  }
  .code-view {
    position: relative;
    margin-top: 20px;
    transition: all .5s linear;

    &.collapse {
      max-height: 100px;
      overflow: hidden;
      background: linear-gradient(#f6f8fa 30%, rgba(246, 248, 250, 0)),
      linear-gradient(rgba(246, 248, 250, 0), #f6f8fa 70%) 0 100%,
      radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)),
      radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)) 0 100%;
      background-repeat: no-repeat;
      background-color: white;
      background-size: 100% 200px, 100% 0, 100% 14px, 100% 14px;
      background-attachment: local, local, scroll, scroll;

      .el-button {
        & {
          color: transparent !important;

          &:after {
            position: absolute;
            top: 50%;
            left: 50%;
            content: '展开';
            color: #1f2d3d;
            transform: translate(-50%, -50%);
          }
        }
        &:hover {
          &:after {
            color: #fff;
          }
        }
      }
    }

    .el-button {
      position: absolute;
      top: 0;
      right: 0;
      border-color: #e4e8f1;
      background-color: #e4e8f1;
      border-top-left-radius: 0;
      border-bottom-right-radius: 0;

      &:hover {
        border-color: #20a0ff;
        background-color: #20a0ff;
        color: #fff;
      }
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
      margin-bottom: 10px;
      font-size: 12px;
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
          padding: 5px 15px 0;
          color: #364149;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .module-name {
          padding-top: 10px;
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

    .el-tag--primary {
      font-size: 14px;

      a {
        color: inherit;

        &:hover {
          text-decoration: underline;
        }
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

      .el-checkbox {
        margin-left: 10px;
      }

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
      vertical-align: middle;

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

    .page-meta {
      height: 22px;
      line-height: 22px;
      font-size: 12px;
      overflow: hidden;
      color: #999;
    }
    .el-user-block {
      vertical-align: 1px;
    }
    .el-user-avatar, .el-user-name {
      display: inline-block;
      vertical-align: middle;
      margin: 0;
    }

    .normal {
      pre, code {
        color: #666;

        .hljs-jsonp {
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
      background-color: #f6f8fa
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
      background-color: #f6f8fa
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
      margin: 2em 0;
      padding: 0 15px 0 10px;
      color: #666;
      border-left: 4px solid #dfe2e5
    }
    blockquote p {
      margin-left: 0;
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
      margin: 0;
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
        top: 15px;
        right: -16px;
        width: 44px;
        line-height: 15px;
        height: 15px;
        text-align: center;
        color: #ccc;
        font-size: 1em;
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
    pre {
      background-color: transparent;
      padding: 0;
    }
    code {
      background-color: #f9fafc;
      padding: 2px 4px;
      border: 1px solid #eaeefb;
      border-radius: 4px;
    }
  }
</style>
