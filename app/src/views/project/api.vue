<template>
  <section :class="'api-editor-container' + (api.id ? ' api-edit':'')" v-loading.body="loading" element-loading-text="加载中">
    <el-form :model="api" :rules="rules" ref="api" @submit.native.prevent="handleSubmit">
      <el-form-item label="接口名称" prop="name">
        <el-input type="text" v-model="api.name"></el-input>
      </el-form-item>
      <el-form-item prop="method">
        <el-select v-model="api.method" placeholder="请求方法">
          <el-option v-for="method in HTTP_METHOD" :label="method" :value="method"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="接口路径" prop="path">
        <el-input v-model="api.path">
          <template slot="prepend">{{ project.base_url }}</template>
        </el-input>
      </el-form-item>
      <el-form-item label="描述说明" prop="description">
        <el-editor v-model="api.description" :toolbar="toolbar" :on-typing="handleTyping"></el-editor>
      </el-form-item>
      <el-form-item prop="status">
        <el-select v-model="api.status" placeholder="接口状态">
          <el-option v-for="status in statusMap" :label="status.text" :value="status.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button native-type="submit" type="primary" :disabled="disabled" :loading="disabled">保存接口信息</el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-if="api.response && api.response.length > 0 " type="card" :closable="true" @tab-click="handleClick" @tab-remove="handleRemove">
      <el-tab-pane v-for="response in api.response">
        <span slot="label">
          {{ response.description || '新增响应' }}
          <i v-if="response.id" class="fa fa-clone" title="复制响应" @click="handleDuplicate(response)"></i>
        </span>
        <el-response :key="response.id" :data="response"></el-response>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<script type="text/babel">
  import { mapGetters, mapActions } from 'vuex'
  import { HTTP_METHOD } from '../../config'
  import ElEditor from '../../components/editor.vue'
  import ElResponse from './response.vue'

  export default {
    components: {
      ElEditor,
      ElResponse
    },
    data() {
      return {
        HTTP_METHOD,
        loading: true,
        disabled: false,
        toolbar: [
          'bold',
          'italic',
          'strikethrough',
          'code',
          'quote',
          'unordered-list',
          'ordered-list',
          'link',
          'preview',
        ],
        description: '',
        fieldsData: [],
        statusMap: [
          { text: '开发中', value: '0' },
          { text: '使用中', value: '1' }
        ],
        api: {
          id: '',
          name: '',
          description: '',
          method: '',
          path: '',
          status: '0'
        },
        rules: {
          name: [
            { required: true, message: '请输入接口名称', trigger: 'blur' }
          ],
          method: [
            { required: true, message: '请选择请求方法', trigger: 'blur' }
          ],
          path: [
            { required: true, message: '请输入接口路径', trigger: 'blur' }
          ]
        }
      }
    },
    computed: mapGetters({
      user: 'user',
      project: 'project',
      currentApi: 'api'
    }),
    beforeRouteEnter({ params: { id, module_id } }, from, next) {
      next(async(vm) => {
        let route = { name: 'project-module', params: { code: vm.project.code } }

        if (id) {
          let result = await vm.fetchApi({ id })

          if (result.code !== 0) {
            next(route)
          }

        } else {
          if (module_id) {
            let result = await vm.fetchModule({ id: module_id })

            if (result.code === 0 && result.data.id) {
              vm.api = {
                id: '',
                name: '',
                description: '',
                method: '',
                path: '',
                status: '0',
                module_id
              }
            } else {
              next(route)
            }
          } else {
            next(route)
          }
        }

        await vm.fetchParams({ project_id: vm.project.id })
        await vm.fetchFields({ project_id: vm.project.id })

        vm.loading = false
      })
    },
    watch: {
      currentApi: {
        handler: 'loadData',
        deep: true
      }
    },
    methods: {
      ...mapActions([
        'fetchApi',
        'fetchModule',
        'createApi',
        'updateApi',
        'duplicateResponse',
        'deleteResponse',
        'fetchParams',
        'fetchFields'
      ]),
      handleTyping(value) {
        this.description = value
      },
      handleDuplicate(response) {
        let data = JSON.parse(JSON.stringify(response))
        data.description = data.description + '_copy'
        this.duplicateResponse(data)
      },
      handleRemove(tab) {
        this.api.response.forEach(async(response) => {
          if ('tab' + response.id === tab.name) {
            await this.deleteResponse(response)
            return false
          }
        })

        return false
      },
      handleClick(tab, event) {
      },
      handleSubmit() {
        this.$refs.api.validate(async(valid) => {
          let result

          if (valid) {
            this.disabled = true
            this.api.description = this.description
            this.api.project_id = this.project.id

            if (this.api.id) {
              result = await this.updateApi(this.api)
            } else {
              result = await this.createApi(this.api)
            }

            this.api = JSON.parse(JSON.stringify(this.api))
            this.disabled = false

            if (result.code === 0) {
              this.$notify.success({
                title: '提示',
                message: '保存成功！',
                duration: 3000
              })

              if (!this.$route.params.id) {
                this.$router.push({ name: 'project-api-edit', params: { code: this.project.code, id: result.data.id } })
              }
            } else {
              this.$notify.error({
                title: '提示',
                message: result.message,
                duration: 3000
              })
            }
          } else {
            return false
          }
        })
      },
      loadData() {
        let param = {
          id: '',
          name: '',
          type: '',
          length: '',
          default_value: '',
          required: false,
          description: ''
        }

        let response = {
          id: '',
          type: '',
          description: '',
          enctype: '',
          body: '{}',
          api_id: this.api.id,
          param: [param]
        }

        this.api = JSON.parse(JSON.stringify(this.currentApi))

        if (this.api.response) {
          this.api.response.forEach(response => {
            if (response.param) {
              if (response.param[response.param.length - 1].id) {
                response.param.push(param)
              }
            } else {
              response.param = [param]
            }
          })

          if (this.api.response[this.api.response.length - 1].id) {
            this.api.response.push(response)
          }
        } else {
          this.api.response = [response]
        }
      }
    }
  }
</script>
<style lang="scss">
  .api-editor-container {
    .el-tabs--card {
      .el-tabs__item {
        &:last-child:before {
          display: inline-block;
          margin-right: 5px;
          font: normal normal normal 14px/1 FontAwesome;
          font-size: inherit;
          text-rendering: auto;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          content: '\f055';
        }
        .el-icon-close:hover {
          background-color: #20a0ff;
        }
      }
    }
    .el-tab-pane {
      padding: 20px 35px 50px;
    }
    .el-tabs__item:last-child {
      .el-icon-close {
        display: none;
      }
    }
    .fa-clone {
      margin-left: 5px;
    }
  }
  .api-edit .el-form {
    background-color: #fafafa;
  }
</style>
