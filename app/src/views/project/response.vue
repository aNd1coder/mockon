<template>
  <section class="el-panel-group">
    <div :class="'el-panel' + (panel[0].collapse ? ' el-panel--collapse ':'')">
      <div class="el-panel-header">
        <span class="el-panel-title" @click="handleCollapse(0)">基础信息 <i class="fa fa-angle-up"></i></span>
      </div>
      <div class="el-panel-container">
        <el-form :model="response" :rules="rules" ref="response" @submit.native.prevent="handleSubmit">
          <el-form-item label="描述" prop="description">
            <el-input v-model="response.description"></el-input>
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
          <el-form-item prop="enctype">
            <el-select v-model="response.enctype" placeholder="编码类型">
              <el-option v-for="enctype in FORM_ENCTYPE" :label="enctype" :value="enctype"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="type">
            <el-select v-model="response.type" placeholder="响应类型">
              <el-option v-for="type in RESPONSE_TYPE" :label="type" :value="type"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button native-type="submit" :disabled="disabled" :loading="disabled">保存响应信息</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div v-if="response.id" :class="'el-panel' + (panel[1].collapse ? ' el-panel--collapse ':'')">
      <div class="el-panel-header">
        <span class="el-panel-title" @click="handleCollapse(1)">请求参数 <i class="fa fa-angle-up"></i></span>
      </div>
      <div class="el-panel-container">
        <el-param v-for="(param, index) in response.param" :response="response" :is-last="index === response.param.length -1" :data="param"></el-param>
      </div>
    </div>
    <el-dialog title="字段描述" v-model="dialogVisible">
      <el-field-block v-for="(value, name) in flattenBody" :response="response" :name="name"></el-field-block>
    </el-dialog>
  </section>
</template>
<script type="text/babel">
  import ace from 'brace'
  import 'brace/mode/json'
  // katzenmilch/solarized_light/sqlserver/tomorrow/tomorrow_night_eighties
  import 'brace/theme/tomorrow'
  import { mapGetters, mapActions } from 'vuex'
  import { FORM_ENCTYPE, RESPONSE_TYPE } from '../../config'
  import { flattenObject } from '../../utils'
  import ElParam from './param.vue'
  import ElResponse from './field.vue'
  import ElFieldBlock from '../../components/field-block.vue'

  export default {
    components: {
      ElParam,
      ElResponse,
      ElFieldBlock
    },
    props: {
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
        panel: [
          { collapse: false },
          { collapse: false }
        ],
        response: {
          id: '',
          type: '',
          description: '',
          enctype: '',
          body: ''
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
          ]
        }
      }
    },
    computed: mapGetters(['user', 'project', 'api', 'fields']),
    watch: {
      api: {
        handler: 'loadData',
        deep: true
      }
    },
    mounted() {
      this.loadData()
    },
    methods: {
      ...mapActions(['createResponse', 'updateResponse']),
      handleCollapse(index) {
        this.panel[index].collapse = !this.panel[index].collapse
      },
      handleDelete() {
        this.$confirm(
          '确定删除该字段?',
          '提示',
          { type: 'warning' }
        ).then(async() => {
          await this.deleteResponse(this.response)

          this.$notify.success({
            title: '提示',
            message: '删除成功!',
            duration: 3000
          })
        }).catch(() => {
        })
      },
      handleSubmit() {
        this.$refs.response.validate(async(valid) => {
          if (valid) {
            let result

            this.disabled = true
            this.response.body = this.body

            if (this.response.id) {
              result = await this.updateResponse(this.response)
            } else {
              this.response.project_id = this.project.id
              this.response.api_id = this.api.id

              result = await this.createResponse(this.response)
            }

            this.response = JSON.parse(JSON.stringify(this.response))
            this.disabled = false

            if (result.code === 0) {
              this.$notify.success({
                title: '提示',
                message: '保存成功！',
                duration: 3000
              })
            } else {
              this.$notify.error({
                title: '提示',
                message: result.message,
                duration: 3000
              })
            }
          }
        })
      },
      handleFormat() {
        if (this.response.body) {
          this.loadData(true)
        }
      },
      handleComment() {
        this.flattenBody = flattenObject(JSON.parse(this.response.body))
        this.dialogVisible = true
      },
      loadData(refresh) {
        let editor
        let body
        let vm = this

        this.response = JSON.parse(JSON.stringify(this.data))
        this.response.body = this.response.body || '{}'

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
  .el-panel {
    margin-bottom: 20px;
  }
  .el-panel-header {
    border-bottom: 1px solid #eeeeee;

    .fa {
      transition: transform .3s;
    }
  }
  .el-panel-title {
    position: relative;
    display: inline-block;
    padding-bottom: 10px;
    border-bottom: 1px solid #20a0ff;
    bottom: -1px;
    cursor: pointer;
  }
  .el-panel-container {
    padding: 20px 0;
    transition: all .3s;
  }
  .el-panel--collapse {
    .fa {
      vertical-align: -2px;
      transform: rotate(180deg);
    }
    .el-panel-container {
      padding: 0;
      height: 0;
      overflow: hidden;
    }
  }
  .el-button-group {
    position: absolute;
    right: 0;
    z-index: 2;

    .el-button {
      width: auto;
      margin-left: 0;
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
