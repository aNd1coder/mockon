<template>
  <section :class="'api-editor-container' + (model && model.id ? ' api-edit':'')" v-loading.body="loading" element-loading-text="加载中">
    <div class="page-header">
      <h1 class="pull-left">接口信息</h1>
      <el-button v-if="model && model.id" class="pull-right" :plain="true" type="primary">
        <router-link :to="{ name: 'document-view', params: { id: base64Encode(model.id) } }"><i class="fa fa-file-code-o"></i>查看文档</router-link>
      </el-button>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="basic">
        <el-form :model="model" :rules="rules" ref="api" @submit.native.prevent="handleSubmit">
          <el-form-item label="接口名称" prop="name">
            <el-input type="text" v-model="model.name"></el-input>
          </el-form-item>
          <el-form-item label="所属分组(可搜索)" prop="module_id">
            <el-select v-model="model.module_id" filterable placeholder="请选择所属分组">
              <el-option v-for="module in modules" :key="module.id" :label="module.name" :value="module.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请求方法" prop="method">
            <el-select v-model="model.method" placeholder="请选择请求方法">
              <el-option v-for="method in HTTP_METHOD" :key="method" :label="method" :value="method"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接口连接" prop="url">
            <el-input v-model="model.url" placeholder="http:// 或 // 开头"></el-input>
          </el-form-item>
          <el-form-item label="开发人员" prop="developer">
            <el-input v-model="model.developer" placeholder="接口开发人员，方便随时联系"></el-input>
          </el-form-item>
          <el-form-item label="描述说明" prop="description">
            <el-editor v-model="model.description" :toolbar="toolbar" :on-typing="handleTyping"></el-editor>
          </el-form-item>
          <el-form-item label="接口状态" prop="status">
            <el-select v-model="model.status" placeholder="请选择接口状态">
              <el-option v-for="status in statusMap" :key="status.value" :label="status.text" :value="status.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="兜底数据连接" prop="backup_url">
            <el-input type="text" v-model="model.backup_url" readonly placeholder="当接口请求失败时用来保证页面正常展示的兜底数据"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button native-type="submit" type="primary" :disabled="disabled" :loading="disabled">保存接口信息</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane v-if="model && model.id" label="响应信息" name="response">
        <el-tabs type="card" v-model="editableTabsValue" :closable="true" @tab-remove="handleDelete">
          <el-tab-pane v-for="response in model.response" :name="response.id + ''" :key="response.id">
            <span slot="label">
              {{ response.description }}<i v-if="response.id" class="fa fa-clone" title="复制响应" @click="handleDuplicate(response)"></i>
            </span>
            <el-response :key="response.id" :apiModel="model" :data="response"></el-response>
          </el-tab-pane>
          <el-tab-pane name="new">
            <span slot="label">新增响应</span>
            <el-response :apiModel="model"></el-response>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane v-if="model && model.id" label="状态码" name="error">
        <el-error v-for="(error, index) in errors" :data="error" :key="error.id"></el-error>
        <el-error></el-error>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<script type="text/babel">
  import { mapGetters, mapActions } from 'vuex'
  import { showNotify, showConfirm, base64Encode, base64Decode } from '../../utils'
  import { HTTP_METHOD } from '../../config'
  import ElEditor from '../../components/editor.vue'
  import ElResponse from './response.vue'
  import ElError from './error.vue'

  export default {
    components: {
      ElEditor,
      ElResponse,
      ElError,
    },
    data() {
      return {
        HTTP_METHOD,
        base64Encode,
        loading: true,
        disabled: false,
        activeName: 'basic',
        editableTabsValue: 'new',
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
        newApi: {},
        model: {
          id: '',
          name: '',
          description: '',
          developer: '',
          method: 'GET',
          path: '',
          status: '1'
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
    computed: mapGetters([
      'user',
      'project',
      'modules',
      'api',
      'errors'
    ]),
    watch: {
      $route: 'loadData',
      api: {
        handler(api) {
          this.model = JSON.parse(JSON.stringify(api))
        },
        deep: true
      }
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.model.url = vm.project.base_url
        vm.newApi = JSON.parse(JSON.stringify(vm.model))
        vm.loadData()
      })
    },
    methods: {
      ...mapActions([
        'fetchApi',
        'fetchModules',
        'fetchModule',
        'createApi',
        'updateApi',
        'duplicateResponse',
        'deleteResponse',
        'fetchParams',
        'fetchFields',
        'fetchErrors',
        'appendApiError'
      ]),
      handleTyping(value) {
        this.description = value
      },
      async handleDuplicate(response) {
        let data = JSON.parse(JSON.stringify(response))
        data.description = data.description + '_copy'
        let result = await this.duplicateResponse(data)

        showNotify(this, result)
      },
      handleDelete(targetName) {
        this.model.response.forEach(response => {
          if (response.id == targetName) {
            showConfirm(this, '确定删除该响应?', async (ctx) => {
              let result = await ctx.deleteResponse(response)
              showNotify(ctx, result, ctx => {
                ctx.selectTab()
              })
            })

            return false
          }
        })

        return false
      },
      async handleClick(tab) {
        this.loading = true

        if (tab.name === 'error') {
          let api_id = this.$route.params.id || 0
          api_id = api_id === 0 ? 0 : base64Decode(api_id)
          await this.fetchErrors({ project_id: this.project.id, api_id })
        } else if (tab.name === 'response') {
          await this.fetchParams({ project_id: this.project.id })
          await this.fetchFields({ project_id: this.project.id })
        }

        this.loading = false
      },
      handleSubmit() {
        this.$refs.api.validate(async(valid) => {
          let result

          if (valid) {
            this.disabled = true
            this.model.description = this.description
            this.model.project_id = this.project.id

            if (this.model.id) {
              result = await this.updateApi(this.model)
            } else {
              result = await this.createApi(this.model)
            }

            this.model = JSON.parse(JSON.stringify(this.model))
            this.disabled = false

            showNotify(this, result, ctx => {
              if (ctx.$route.params.id) {
                ctx.selectTab(true)
              } else {
                setTimeout(() => {
                  ctx.$router.push({ name: 'project-api-edit', params: { code: ctx.project.code, id: result.data.id } })
                }, 200)
              }
            })
          } else {
            return false
          }
        })
      },
      selectTab(last) {
        let index = 0, count

        if (this.api.response && this.api.response.length > 0) {
          count = this.api.response.length

          if (last === true) {
            index = count - 1
          }

          this.editableTabsValue = this.api.response[index].id + ''
        } else {
          this.editableTabsValue = 'new'
        }
      },
      async loadData() {
        let id = this.$route.params.id
        let module_id = this.$route.params.module_id

        await this.fetchModules({ project_id: this.project.id })

        if (id) {
          id = base64Decode(id)
          await this.fetchApi({ id })

          this.model = JSON.parse(JSON.stringify(this.api))
        } else {
          if (module_id) {
            module_id = base64Decode(module_id)

            let result = await this.fetchModule({ id: module_id })

            if (result.code === 0 && result.data.id) {
              this.editableTabsValue = 'new'

              this.model = JSON.parse(JSON.stringify(this.newApi))
              this.model.module_id = module_id
            }
          }
        }

        this.selectTab()

        this.loading = false
      }
    }
  }
</script>
<style lang="scss">
  .api-editor-container {
    .page-header {
      padding: 20px;
      border-bottom: none;
    }
    .el-tabs__header {
      padding: 0;
    }
    .el-tab-pane {
      .el-tabs__header {
        background-color: transparent;
      }
      .el-tab-pane {
        padding: 15px;
        border: 1px solid rgb(209, 219, 229);
        border-top: none;
      }
    }
    .el-tabs__item.is-active {
      background-color: transparent;
    }
    .el-tabs--card {
      .el-tabs__item {
        &:last-child:after {
          display: inline-block;
          margin-left: 5px;
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
    .el-form {
      padding: 0;
    }
    .el-tab-pane {
      padding: 20px;
    }
    .el-tabs__item:last-child {
      .el-icon-close {
        display: none;
      }
    }
    .fa-clone {
      margin-left: 5px;
    }
    .ace_scroller:after {
      position: absolute;
      content: 'JSON';
      font-size: 10rem;
      color: #f5f5f5;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .el-form-param {
      .el-select {
        &:hover, &:focus {
          .el-input__inner {
            border-color: transparent transparent #20a0ff transparent;
          }
        }
      }
    }
  }
</style>
