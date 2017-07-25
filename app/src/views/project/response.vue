<template>
  <section>
    <el-form :model="response" :rules="rules" ref="response" @submit.native.prevent="handleSubmit">
      <el-form-item label="响应描述" prop="description">
        <el-input v-model="response.description"></el-input>
      </el-form-item>
      <el-form-item label="编码类型" prop="enctype">
        <el-select v-model="response.enctype" placeholder="请选择编码类型">
          <el-option v-for="enctype in FORM_ENCTYPE" :key="enctype" :label="enctype" :value="enctype"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="JSONP Callback 名称" prop="jsonp_callback">
        <el-input v-model="response.jsonp_callback" placeholder="非空则为 JSONP 响应"></el-input>
      </el-form-item>
      <el-form-item label="请求参数">
        <el-param v-if="response && response.id" v-for="(param, index) in response.param" :key="param.id" :response="response" :data="param"></el-param>
        <el-param :response="response && response.id ? response : {}"></el-param>
      </el-form-item>
      <el-form-item label="响应内容（文档展示）">
        <el-button-group>
          <el-button type="primary" size="small" :plain="true" @click="handleFormat">
            <i class="fa fa-code"></i>格式化
          </el-button>
          <el-button type="primary" size="small" :plain="true" @click="handleComment">
            <i class="fa fa-pencil"></i>字段描述
          </el-button>
        </el-button-group>
        <div class="editor" ref="editor"></div>
      </el-form-item>
      <el-form-item label="兜底数据连接" prop="backup_url">
        <el-input type="text" v-model="response.backup_url" readonly placeholder="当接口请求失败时用来保证页面正常展示的兜底数据"></el-input>
      </el-form-item>
      <el-form-item label="Mock 模版">
        <template slot="label">Mock 模版（可注入 Mock 链接中的参数，<a href="http://mockjs.com/examples.html" target="_blank">查看 Mockjs 示例</a>）</template>
        <el-button-group>
          <el-button type="primary" size="small" :plain="true" @click="handlePreview">
            <i class="fa fa-eye"></i>数据预览
          </el-button>
        </el-button-group>
        <div class="template" ref="template"></div>
      </el-form-item>
      <el-form-item label="响应类型" prop="type">
        <el-select v-model="response.type" placeholder="请选择响应类型">
          <el-option v-for="(label, type) in RESPONSE_TYPE" :key="type" :label="label" :value="type"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button native-type="submit" type="primary" :disabled="disabled" :loading="disabled">保存响应信息</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="字段描述" v-model="dialogVisible">
      <el-field-block v-for="(value, name) in flattenBody" :key="name" :response="response" :name="name"></el-field-block>
      <div v-if="apiModel.method === 'GET' && response.id" class="btn-backup">
        <el-button type="primary" :disabled="disabled" :loading="disabled" @click="handleBindBackup">
          {{ response.backup_url ? '更新' : '接入' }}兜底服务
        </el-button>
        <el-button v-if="response.backup_url" :disabled="disabled" :loading="disabled" @click="handleUnbindBackup">取消兜底服务</el-button>
      </div>
    </el-dialog>
    <el-dialog size="large" title="Mock 数据预览" v-model="dialogMockVisible">
      <a class="refresh" href="javascript:;" @click="handlePreview"><i class="fa fa-refresh"></i>刷新数据</a>
      <a class="external-link" :href="mockUrl" target="_blank"><i class="fa fa-external-link"></i>窗口打开</a>
      <div class="preview" ref="preview"></div>
    </el-dialog>
  </section>
</template>
<script type="text/babel">
  import ace from 'brace'
  import 'brace/mode/json'
  import 'brace/mode/ejs'
  import 'brace/theme/tomorrow'
  import 'brace/theme/tomorrow_night_eighties'
  import jsonSchemaGenerator from 'json-schema-generator'
  import { mapGetters, mapActions } from 'vuex'
  import {
    FORM_ENCTYPE,
    RESPONSE_TYPE,
    BACKUP_API,
    MOCK_URL
  } from '../../config'
  import {
    flattenObject,
    showNotify,
    base64Encode
  } from '../../utils'
  import ElParam from './param.vue'
  import ElFieldBlock from '../../components/field-block.vue'

  export default {
    components: {
      ElParam,
      ElFieldBlock
    },
    props: {
      apiModel: Object,
      data: Object
    },
    data() {
      return {
        FORM_ENCTYPE,
        RESPONSE_TYPE,
        disabled: false,
        dialogVisible: false,
        dialogMockVisible: false,
        body: '',
        template: '',
        mockData: '',
        flattenBody: {},
        newResponse: {},
        response: {
          id: '',
          type: 'success',
          description: '',
          enctype: 'application/json',
          jsonp_callback: '',
          body: '{}',
          backup_url: '',
          template: ''
        },
        rules: {
          description: [
            { required: true, message: '请输入响应名称', trigger: 'blur' }
          ],
          enctype: [
            { required: true, message: '请选择编码类型', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请输入响应类型', trigger: 'blur' }
          ],
          body: [
            { required: true, message: '请输入响应内容', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters(['user', 'project', 'api', 'fields']),
      mockUrl() {
        return MOCK_URL + base64Encode(this.response.id)
      }
    },
    watch: {
      api: {
        handler: 'loadData',
        deep: true
      }
    },
    mounted() {
      this.newResponse = JSON.parse(JSON.stringify(this.response))
      this.loadData()
      this.initEditor({
        ref: 'editor',
        field: 'body',
        mode: 'json',
        theme: 'tomorrow'
      })

      this.initEditor({
        ref: 'template',
        field: 'template',
        mode: 'ejs',
        theme: 'tomorrow'
      })
    },
    methods: {
      ...mapActions([
        'createResponse',
        'updateResponse',
        'bindBackup',
        'unBindBackup'
      ]),
      handleSubmit() {
        this.$refs.response.validate(async(valid) => {
          if (valid) {
            let result

            this.disabled = true
            this.response.body = this.body
            this.response.template = this.template

            if (this.response.id) {
              result = await this.updateResponse(this.response)
            } else {
              this.response.project_id = this.project.id
              this.response.api_id = this.api.id

              result = await this.createResponse(this.response)
            }

            this.response = JSON.parse(JSON.stringify(this.response.id ? this.response : this.newResponse))
            this.disabled = false

            showNotify(this, result)
          }
        })
      },
      handleFormat() {
        if (this.response.body) {
          this.initEditor({
            ref: 'editor',
            field: 'body',
            mode: 'json',
            theme:'tomorrow',
            refresh: true
          })
        }
      },
      handleComment() {
        this.flattenBody = flattenObject(JSON.parse(this.response.body))
        this.dialogVisible = true
      },
      async handleBindBackup() {
        let name = this.apiModel.name + this.response.description
        let url = this.apiModel.url
        let body = JSON.parse(this.response.body)
        let rules = jsonSchemaGenerator(body)
        let callback = this.response.jsonp_callback
        let type = callback ? 'jsonp' : 'cors'
        let charset = 'utf8'
        let params = []

        this.response.param.forEach(param => {
          if (param.location === 'query') {
            params.push(param.name + '=' + param.default_value)
          }
        })

        // 追加参数
        if (params.length > 0) {
          url = url + (url.indexOf('?') !== -1 ? '' : '?') + params.join('&')
        }

        let data = {
          project_id: this.project.id,
          response_id: this.response.id,
          name,     // 接口名称
          url,      // 接口地址
          rules,    // 接口校验规则 json-schema
          callback, // 数据在京东云上，涉及跨域
          type,     // 接口类型，jsonp、cors两种，enum: ['jsonp', 'cors']
          charset,  // 接口编码
        }

        // 更新
        if (this.response.backup_url) {
          data.backup = this.response.backup_url
        }

        let result = await this.bindBackup(data)

        this.response.backup_url = result.data.backup_url

        showNotify(this, result)
      },
      async handleUnbindBackup() {
        let backup = this.response.backup_url
        let result = await this.unBindBackup({
          project_id: this.project.id,
          response_id: this.response.id,
          backup
        })

        this.response.backup_url = ''

        showNotify(this, result)
      },
      handlePreview() {
        this.loading = true

        fetch(this.mockUrl + '?format=json').then(res => {
          return res.text()
        }).then(content => {
          this.dialogMockVisible = true

          try {
            JSON.parse(content)

            setTimeout(_ => {
              if (this.$refs.preview) {
                this.initEditor({
                  ref: 'preview',
                  content,
                  mode: 'json',
                  theme: 'tomorrow_night_eighties',
                  readonly: true
                })

                this.loading = false
              }
            }, 10)
          } catch (e) {
            this.$message.error(content)
          }
        })
      },
      loadData() {
        if (this.data && this.data.id) {
          this.response = JSON.parse(JSON.stringify(this.data))
          this.response.body = this.response.body || '{}'
        }
      },
      initEditor(option) {
        let vm = this
        let editor
        let content

        editor = ace.edit(this.$refs[option.ref])
        editor.$blockScrolling = Infinity
        editor.getSession().setMode(`ace/mode/${option.mode}`)
        editor.getSession().setTabSize(2)
        editor.setTheme(`ace/theme/${option.theme}`)
        editor.setOptions({ maxLines: 20, minLines: 10 })
        editor.setShowPrintMargin(false)

        if (option.readonly && option.readonly === false) {
          editor.setReadOnly(false)
        }

        if (option.field) {
          editor.on('change', function () {
            vm[option.field] = editor.getValue()
          })

          content = true === option.refresh ? (editor.getValue() || '{}') : (this.response[option.field] || '')
        } else {
          content = option.content
        }

        if (option.mode === 'json') {
          content = JSON.stringify(JSON.parse(content), null, 2)
        }

        editor.setValue(content)
        editor.clearSelection()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .el-form {
    padding: 0;
    margin-bottom: 20px;
    background-color: transparent;

    .el-input__inner {
      border-color: #fff;
      padding-left: 5px;
      border-radius: 0;

      &:hover {
        border-color: #20a0ff;
      }
    }
  }
  a {
    color: #20a0ff;

    &:hover {
      text-decoration: underline;
    }
  }
  .btn-backup {
    margin-top: 20px;

    .el-button {
      display: block;
      width: 100%;
      margin: 10px 0 0 0;
    }
  }
  .el-button-group {
    position: absolute;
    right: 0;
    z-index: 2;

    .el-button {
      width: auto;
      border-radius: 0;
      border-color: #c0ccda;

      &:hover {
        border-color: #20a0ff;
      }
    }
  }
  .editor, .template {
    width: 100%;
    border: 1px solid #c0ccda;
  }
  .refresh {
    margin-right: 10px;
  }
  .preview {
    margin-top: 10px;
  }
</style>
