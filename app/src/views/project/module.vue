<template>
  <section>
    <div class="page-header">
      <h1 class="pull-left">接口管理</h1>
    </div>
    <el-row>
      <el-col :span="24">
        <ul class="modules">
          <li v-for="module in modules" class="module">
            <h3 class="module-name">
              <i class="fa fa-angle-right"></i>{{ module.name }}
              <a href="javascript:;" @click="handleDelete(module)">删除</a>
              <a href="javascript:;" @click="handleUpdate(module)">编辑</a>
              <router-link :to="{ name: 'project-api-new', params: { code: project.code, module_id: base64Encode(module.id) } }">新增接口</router-link>
            </h3>
            <ul v-if="module.api && module.api.length > 0" class="apis">
              <li v-for="api in module.api" class="api">
                <el-http-method :method="api.method"></el-http-method>
                <router-link title="查看文档" class="link-document" target="_blank" :to="{ name: 'document-view', params: { id: base64Encode(api.id) } }">
                  {{ api.name }}
                  {{ api.url }}
                </router-link>
                <a href="javascript:;" @click="handleApiDelete(api)">删除</a>
                <router-link :to="{ name: 'project-api-edit', params: { code: project.code, id: base64Encode(api.id) } }">编辑</router-link>
                <a href="javascript:;" @click="handleApiDuplicate(api)">复制</a>
              </li>
            </ul>
            <span v-else class="nodata">无接口信息</span>
          </li>
          <li class="module module-new">
            <h3 class="module-name" @click="handleCreate">
              <i class="fa fa-plus-circle"></i>新增分组
            </h3>
          </li>
        </ul>
      </el-col>
    </el-row>
    <el-dialog :title="title" v-model="dialogVisible">
      <el-form :model="module" :rules="rules" ref="module" @submit.native.prevent="handleSubmit">
        <el-form-item label="分组名称" prop="name">
          <el-input type="text" v-model="module.name"></el-input>
        </el-form-item>
        <el-form-item label="分组代码" prop="code">
          <el-input type="text" v-model="module.code" placeholder="小写字母及数字组合，建议使用简明的英文单词，用来标识分组"></el-input>
        </el-form-item>
        <el-form-item label="分组描述" prop="description">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2 }" v-model="module.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button native-type="submit" type="primary" :disabled="disabled" :loading="disabled">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>
<script type="text/babel">
  import { mapGetters, mapActions } from 'vuex'
  import { showNotify, showConfirm, base64Encode } from '../../utils'
  import ElHttpMethod from '../../components/http-method.vue'
  import ElNodata from '../../components/nodata.vue'

  export default {
    components: {
      ElHttpMethod,
      ElNodata
    },
    data() {
      return {
        title: '',
        dialogVisible: false,
        disabled: false,
        base64Encode,
        module: {
          id: '',
          name: '',
          code: '',
          description: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入分组名称', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请输入分组代码', trigger: 'blur' }
          ]
        }
      }
    },
    computed: mapGetters(['session', 'project', 'modules']),
    beforeRouteEnter(to, from, next) {
      next(async(vm) => {
        await vm.fetchModules({ project_id: vm.project.id })
      })
    },
    methods: {
      ...mapActions([
        'fetchModules',
        'createModule',
        'deleteModule',
        'updateModule',
        'deleteApi',
        'duplicateApi'
      ]),
      handleCreate() {
        this.title = '新增分组'
        this.module = {
          id: '',
          name: '',
          code: '',
          description: ''
        }
        this.dialogVisible = true
      },
      handleUpdate(module) {
        this.title = '修改分组'
        this.dialogVisible = true
        this.module = JSON.parse(JSON.stringify(module))
      },
      handleDelete(module) {
        showConfirm(this, '删除分组会连同关联的数据一并删除，确定要删除?', async (ctx) => {
          let result = await ctx.deleteModule(module)
          showNotify(ctx, result)
        })
      },
      handleApiDelete(api) {
        showConfirm(this, '删除接口会连同关联的数据一并删除，确定要删除?', async (ctx) => {
          let result = await ctx.deleteApi(api)
          showNotify(ctx, result)
        })
      },
      async handleApiDuplicate(api) {
        let result
        let data = JSON.parse(JSON.stringify(api))

        data.name = data.name + '_copy'
        result = await this.duplicateApi(data)

        showNotify(this, result)
      },
      handleSubmit() {
        this.$refs.module.validate(async(valid) => {
          let result

          if (valid) {
            this.disabled = true

            this.module.project_id = this.project.id

            if (this.module.id) {
              result = await this.updateModule(this.module)
            } else {
              result = await this.createModule(this.module)
            }

            this.disabled = false

            showNotify(this, result, ctx => {
              ctx.dialogVisible = false
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .modules {
    position: relative;
    padding: 20px;
  }
  .module {
    padding-bottom: 20px;

    &:hover {
      h3 {
        a {
          opacity: 1;
          transform: none;
        }
      }
    }

    .module-name {
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 400;
      overflow: hidden;

      a {
        display: inline-block;
        margin-left: 10px;
        font-size: 12px;
        color: #999;
        opacity: 0;
        transition: transform .3s ease-in-out;
        transform: translate3d(0, 50px, 0);

        &:hover {
          color: #20a0ff;
        }
      }

      .fa {
        color: #999;
      }
    }

    .nodata {
      border-left: 3px solid #999;
      padding-left: 5px;
      font-size: 14px;
      color: #999;
    }
  }
  .module-new .module-name {
    display: inline-block;
    border: 1px dashed #d9d9d9;
    padding: 2px 5px;
    color: #d9d9d9;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      color: #20a0ff;
      border-color: #20a0ff;
    }
  }
  .apis {
    font-size: 14px;
  }
  .api {
    margin-bottom: 5px;
    color: #666;

    &:hover {
      a {
        display: inline-block;
      }

      .link-document {
        color: #20a0ff;
        text-decoration: underline;
      }
    }

    .el-tag {
      margin: 0;
    }

    .link-document {
      display: inline-block;
      margin: 0 0 0 5px;
      color: #333;
    }

    a {
      display: none;
      margin-left: 10px;
      font-size: 12px;
      color: #999;

      &:hover {
        color: #20a0ff;
      }
    }
  }
</style>
