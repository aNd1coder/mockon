<template>
  <el-form :model="project" :class="project && project.id ? '' : 'el-form-block'" :rules="rules" ref="project" @submit.native.prevent="handleSubmit">
    <el-form-item label="项目名称" prop="name">
      <el-input type="text" v-model="project.name" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="项目代号" prop="code">
      <el-input type="text" v-model="project.code" placeholder="小写字母及数字组合，建议使用简明的英文单词，用来标识项目"></el-input>
    </el-form-item>
    <el-form-item label="基础路径" prop="base_url">
      <el-input type="text" v-model="project.base_url" placeholder="http://api.domain.com/v1"></el-input>
    </el-form-item>
    <el-form-item label="编码类型" prop="enctype">
      <el-select v-model="project.enctype">
        <el-option v-for="enctype in FORM_ENCTYPE" :label="enctype" :value="enctype"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="项目图标" prop="image">
      <el-row>
        <el-col class="image-preview" :span="7">
          <img v-if="project.image" :src="project.image | imgformat"/>
          <i v-else class="fa fa-file-image-o"></i>
        </el-col>
        <el-col :span="16" :offset="1">
          <el-upload
            type="drag"
            :action="UPLOAD_URL"
            :thumbnail-mode="true"
            :on-success="handleSuccess">
            <i class="el-icon-upload"></i>
            <div class="el-dragger__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="项目描述" prop="description">
      <el-editor v-model="project.description" :toolbar="toolbar" :on-typing="handleTyping"></el-editor>
    </el-form-item>
    <el-form-item label="是否私有" prop="private">
      <el-switch on-text="私有" off-text="公开" v-model="project.private"></el-switch>
    </el-form-item>
    <el-form-item>
      <el-button native-type="submit" type="primary" :disabled="disabled" :loading="disabled">保存</el-button>
    </el-form-item>
  </el-form>
</template>
<script type="text/babel">
  import { mapActions } from 'vuex'
  import ElEditor from '../../components/editor.vue'
  import { UPLOAD_URL, FORM_ENCTYPE } from '../../config'

  export default {
    name: 'project-form',
    components: {
      ElEditor
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
        project: {
          name: '',
          code: '',
          image: '',
          base_url: '',
          description: '',
          enctype: '',
          private: false
        },
        rules: {
          name: [
            { required: true, message: '请输入项目名称', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请输入项目代码', trigger: 'blur' }
          ],
          base_url: [
            { required: true, message: '请输入基础路径', trigger: 'blur' }
          ]
        }
      }
    },
    async mounted(){
      let code = this.$route.params.code

      if (code) {
        let result = await this.fetchProject({ code })
        this.project = JSON.parse(JSON.stringify(result.data))
        this.project.private = !!this.project.private
      }
    },
    methods: {
      ...mapActions(['fetchProject', 'createProject', 'updateProject']),
      handleTyping(value) {
        this.description = value
      },
      handleSuccess(result) {
        this.project.image = result.data
      },
      handleSubmit() {
        this.$refs.project.validate(async(valid) => {
          if (valid) {
            this.disabled = true
            this.project.description = this.description
            this.project.private = this.project.private ? 1 : 0

            if (this.project.id) {
              await this.updateProject(this.project)

              this.$notify.success({
                title: '提示',
                message: '设置成功！',
                duration: 3000
              })
            } else {
              await this.createProject(this.project)

              this.$notify.success({
                title: '提示',
                message: '创建成功！',
                duration: 3000
              })

              this.$router.push({ name: 'project' })
            }

            this.disabled = false
          } else {
            return false
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .image-preview {
    height: 180px;
    line-height: 180px;
    border: 1px solid #c0ccda;
    text-align: center;
    background-color: #f9fafc;
    display: table-cell;
    vertical-align: middle;
    border-radius: 4px;
    overflow: hidden;

    img {
      max-width: 100%;
      max-height: 180px;
      vertical-align: 3px;
    }

    .fa {
      margin: 0;
      font-size: 50px;
      color: #e0e0e0;
    }
  }
</style>

