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
      <el-form-item class="el-form-mockjs" prop="is_mockjs">
        <template v-if="response.id"><a class="el-tag el-tag--gray" :href="mockUrl" target="_blank">{{ mockUrl }}</a></template>
        <el-switch v-model="response.is_mockjs" :width="80" on-text="Mockjs" off-text="Normal"></el-switch>
      </el-form-item>
      <el-form-item label="响应内容">
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
      <div v-if="apiModel.method === 'GET'" class="btn-backup">
        <el-button type="primary" :disabled="disabled" :loading="disabled" @click="handleBindBackup">提交兜底服务数据</el-button>
        <el-button :disabled="disabled" :loading="disabled" @click="handleUnbindBackup">禁用数据兜底服务</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script type="text/babel">
  import ace from 'brace'
  import 'brace/mode/json'
  // katzenmilch/solarized_light/sqlserver/tomorrow/tomorrow_night_eighties
  import 'brace/theme/tomorrow'
  import jsonSchemaGenerator from 'json-schema-generator'
  import Mockjs from 'mockjs'
  import { mapGetters, mapActions } from 'vuex'
  import { FORM_ENCTYPE, RESPONSE_TYPE, BACKUP_API, MOCK_URL } from '../../config'
  import { flattenObject, showNotify, base64Encode } from '../../utils'
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
        body: '',
        flattenBody: {},
        newResponse: {},
        response: {
          id: '',
          type: 'success',
          description: '',
          enctype: 'application/json',
          jsonp_callback: '',
          is_mockjs: false,
          body: '{}'
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
      this.initEditor()
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
            this.response.is_mockjs = this.response.is_mockjs === true ? 1 : 0

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
          this.initEditor(true)
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
        let is_mockjs = this.response.is_mockjs
        let rules = jsonSchemaGenerator(is_mockjs ? Mockjs.mock(body) : body)
        let callback = this.response.jsonp_callback
        let type = callback ? 'jsonp' : 'cors'
        let charset = 'utf-8'
        let result = await this.bindBackup({
          name,     // 接口名称
          url,      // 接口地址
          rules,    // 接口校验规则 json-schema
          callback, // 数据在京东云上，涉及跨域
          type,     // 接口类型，jsonp、cors两种，enum: ['jsonp', 'cors']
          charset,  // 接口编码
        })

        result.code = result.rtn
        result.message = result.msg

        showNotify(this, result, ctx => {
          ctx.response.backup_url = result.data.backup
        })
      },
      async handleUnbindBackup() {
        let backup = this.apiModel.url
        let result = await this.unBindBackup({ backup })

        result.code = result.rtn
        result.message = result.msg

        showNotify(this, result)
      },
      loadData() {
        if (this.data && this.data.id) {
          this.response = JSON.parse(JSON.stringify(this.data))
          this.response.body = this.response.body || '{}'
          this.response.is_mockjs = this.response.is_mockjs === 1 ? true : false
        }
      },
      initEditor(refresh) {
        let editor
        let body
        let vm = this

        editor = ace.edit(this.$refs.editor)
        editor.$blockScrolling = Infinity
        editor.getSession().setMode('ace/mode/json')
        editor.getSession().setTabSize(2)
        editor.setTheme('ace/theme/tomorrow')
        editor.setOptions({ maxLines: Infinity })
        editor.setShowPrintMargin(false)
        editor.on('change', function () {
          vm.body = editor.getValue()
        })

        body = true === refresh ? (editor.getValue() || '{}') : this.response.body

        editor.setValue(JSON.stringify(JSON.parse(body), null, 2))
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
  .editor {
    width: 100%;
    min-height: 150px;
    border: 1px solid #c0ccda;
  }
</style>
<style lang="scss">
  .el-form-mockjs {
    position: absolute;
    right: 15px;
    overflow: hidden;

    .el-form-item__content {
      float: left;
      clear: none;
    }
  }
</style>
