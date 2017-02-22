<template>
  <el-row type="flex">
    <el-col :span="8" :offset="8">
      <el-form :model="user" :rules="rules" ref="user" @submit.native.prevent="handleSubmit" class="el-form-block">
        <el-form-item label="邮  箱" prop="email">
          <el-input type="text" v-model="user.email"></el-input>
        </el-form-item>
        <el-form-item label="密  码" prop="password">
          <el-input type="password" v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button native-type="submit" type="primary" :disabled="disabled" :loading="disabled">注册</el-button>
          <div class="el-form-help">
            <span class="pull-right">已有账号？<router-link :to="{ name: 'signin' }">前往登录</router-link></span>
          </div>
        </el-form-item>
        <el-alert v-if="message" :title="message" type="error"></el-alert>
      </el-form>
    </el-col>
  </el-row>
</template>
<script type="text/babel">
  import { mapActions } from 'vuex'

  export default {
    data() {
      return {
        disabled: false,
        message: false,
        user: {
          email: '',
          password: ''
        },
        rules: {
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      ...mapActions(['signUp']),
      handleSubmit() {
        this.$refs.user.validate(async(valid) => {
          if (valid) {
            this.disabled = true

            let result = await this.signUp(this.user)

            if(result.code === 0) {
              let next = this.$route.query.next

              if(next) {
                this.$router.push(next)
              } else {
                this.$router.push({ name: 'signin' })
              }
            } else {
              this.message = result.message
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
