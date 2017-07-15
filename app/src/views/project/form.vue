<template>
  <section>
    <h1 v-if="editMode" class="page-header">项目信息</h1>
    <el-form :model="model" :class="editMode ? '' : 'el-form-block'" :rules="rules" ref="project" @submit.native.prevent="handleSubmit">
      <el-form-item label="项目名称" prop="name">
        <el-input type="text" v-model="model.name" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="项目代号" prop="code">
        <el-input type="text" v-model="model.code" placeholder="小写字母及数字组合，建议使用简明的英文单词，用来标识项目"></el-input>
      </el-form-item>
      <el-form-item label="基础路径" prop="base_url">
        <el-input type="text" v-model="model.base_url" placeholder="http://api.domain.com/v1"></el-input>
      </el-form-item>
      <el-form-item label="Swagger Docs API（批量导入接口数据）" prop="swagger_url">
        <el-input type="text" v-model="model.swagger_url" placeholder="http://petstore.swagger.io/v2/swagger.json"></el-input>
      </el-form-item>
      <el-form-item label="编码类型" prop="enctype">
        <el-select v-model="model.enctype" placeholder="请选择编码类型">
          <el-option v-for="enctype in FORM_ENCTYPE" :key="enctype" :label="enctype" :value="enctype"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目图标" prop="image">
        <el-row>
          <el-col class="image-preview" :span="7">
            <img :src="model.image | imgformat"/>
          </el-col>
          <el-col :span="16" :offset="1">
            <el-upload drag :action="UPLOAD_URL" :on-success="handleSuccess">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="项目描述" prop="description">
        <el-editor v-model="model.description" :toolbar="toolbar" :on-typing="handleTyping"></el-editor>
      </el-form-item>
      <el-form-item label="是否私有" prop="private">
        <el-switch on-text="私有" off-text="公开" v-model="private"></el-switch> 公开则对所有用户可见
      </el-form-item>
      <el-form-item label="项目状态" prop="status">
        <el-select v-model="model.status" placeholder="请选择项目状态">
          <el-option label="正常" :value="0"></el-option>
          <el-option label="废弃" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button native-type="submit" type="primary" :disabled="disabled" :loading="disabled">保存</el-button>
      </el-form-item>
      <el-form-item v-if="editMode">
        <el-button v-if="session.id && model.user_id === session.id" type="danger" :disabled="disabled" :loading="disabled" @click="handleDelete">删除</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>
<script type="text/babel">
  import { mapGetters, mapActions } from 'vuex'
  import ElEditor from '../../components/editor.vue'
  import { UPLOAD_URL, FORM_ENCTYPE } from '../../config'
  import { showNotify, showConfirm }from '../../utils'

  export default {
    name: 'project-form',
    components: {
      ElEditor
    },
    props: {
      editMode: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        disabled: false,
        UPLOAD_URL,
        FORM_ENCTYPE,
        toolbar: [
          'bold',
          'italic',
          'strikethrough',
          'unordered-list',
          'ordered-list',
          'link',
          'preview',
        ],
        description: '',
        private: false,
        model: {
          name: '',
          code: '',
          image: '',
          base_url: '',
          description: '',
          enctype: 'application/json',
          private: false,
          status: 0,
        },
        rules: {
          name: [
            { required: true, message: '请输入项目名称', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请输入项目代号', trigger: 'blur' }
          ]
        }
      }
    },
    computed: mapGetters(['session', 'project']),
    watch: {
      project() {
        this.loadData()
      }
    },
    mounted () {
      this.loadData()
    },
    methods: {
      ...mapActions([
        'createProject',
        'updateProject',
        'deleteProject',
        'deleteMember'
      ]),
      handleTyping(value) {
        this.description = value
      },
      handleSuccess(result) {
        this.model.image = result.data
      },
      handleDelete() {
        showConfirm(this, '删除项目会连同关联的数据一并删除，确定要删除?', async (ctx) => {
          let result = await ctx.deleteProject(ctx.model)
          showNotify(ctx, result, ctx => {
            ctx.$router.push({ name: 'index' })
          })
        })
      },
      handleSubmit() {
        this.$refs.project.validate(async(valid) => {
          if (valid) {
            let result

            this.disabled = true
            this.model.description = this.description
            this.model.private = this.private ? 1 : 0

            if (this.model.id) {
              result = await this.updateProject(this.model)
            } else {
              result = await this.createProject(this.model)
            }

            this.disabled = false

            showNotify(this, result)

            if (result.code === 0) {
              this.$router.push({ name: 'project' })
            }
          } else {
            return false
          }
        })
      },
      loadData() {
        if (this.editMode) {
          this.model = JSON.parse(JSON.stringify(this.project))
          this.private = !!this.model.private
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .image-preview {
    position: relative;
    height: 180px;
    border: 1px dashed #d9d9d9;
    background-color: #fff;
    border-radius: 4px;
    overflow: hidden;

    &:before {
      position: absolute;
      top: 50%;
      left: 50%;
      font: normal normal normal 160px/1 FontAwesome;
      text-rendering: auto;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      content: '\f09b';
      color: #e6ebf1;
      transform: translate(-50%, -50%);
    }

    img {
      position: absolute;
      top: 50%;
      left: 50%;
      max-width: 90%;
      max-height: 90%;
      transform: translate(-50%, -50%);
    }
  }
</style>
<style lang="scss">
  .el-upload-dragger { width: 100%; }
</style>

