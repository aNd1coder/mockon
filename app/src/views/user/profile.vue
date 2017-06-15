<template>
  <el-row class="user-profile">
    <el-col :span="10" :offset="7">
      <el-form :model="user" :rules="rules" ref="user" @submit.native.prevent="handleSubmit" class="el-form-block">
        <el-form-item label="邮箱" prop="email">
          <el-input type="text" v-model="user.email"></el-input>
        </el-form-item>
        <el-form-item label="账户" prop="username">
          <el-input type="text" v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="user.password" placeholder="不修改则留空"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input type="text" v-model="user.nickname"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input type="text" v-model="user.mobile"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-row>
            <el-col class="image-preview" :span="11">
              <el-user-block :user="user" :size="160" class="avatar" :nameVisible="false"></el-user-block>
            </el-col>
            <el-col :span="12" :offset="1">
              <el-upload drag
                 :action="UPLOAD_URL"
                 :on-success="handleSuccess">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-editor v-model="user.description" :toolbar="toolbar" :on-typing="handleTyping"></el-editor>
        </el-form-item>
        <el-form-item>
          <el-button native-type="submit" type="primary" :disabled="disabled" :loading="disabled">保存</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script type="text/babel">
  import { mapGetters, mapActions } from 'vuex'
  import { UPLOAD_URL } from '../../config'
  import { showNotify } from '../../utils'
  import ElEditor from '../../components/editor.vue'
  import ElUserBlock from '../../components/user-block.vue'

  export default {
    components: {
      ElEditor,
      ElUserBlock
    },
    data() {
      return {
        UPLOAD_URL,
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
        disabled: false,
        user: {
          id: '',
          username: '',
          password: '',
          nickname: '',
          email: '',
          mobile: '',
          avatar: '',
          description: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          ]
        }
      }
    },
    computed: mapGetters(['session']),
    beforeRouteEnter(to, from, next) {
      next(async(vm) => {
        vm.user = JSON.parse(JSON.stringify(vm.session))
      })
    },
    methods: {
      ...mapActions(['updateUser']),
      handleSuccess(result) {
        this.user.avatar = result.data
      },
      handleTyping(value) {
        this.description = value
      },
      handleSubmit() {
        this.$refs.user.validate(async(valid) => {
          if (valid) {
            let result

            this.disabled = true
            this.user.description = this.description

            result = await this.updateUser(this.user)

            showNotify(this, result, ctx => {
              location.href = '/signin'
            })

            this.disabled = false
          } else {
            return false
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .user-profile {
    .el-user-block, .el-user-avatar {
      display: block;
      width: 100%;
      height: 180px;
    }

    .el-user-avatar:before {
      font-size: 160px;
    }
  }
  .image-preview {
    height: 180px;
    line-height: 180px;
    border: 1px dashed #d9d9d9;
    text-align: center;
    background-color: #fff;
    display: table-cell;
    vertical-align: middle;
    border-radius: 4px;
    overflow: hidden;
  }
</style>
