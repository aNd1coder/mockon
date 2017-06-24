<template>
  <el-row type="flex">
    <el-col :span="8" :offset="8">
      <el-form :model="user" :rules="rules" ref="user" @submit.native.prevent="handleSubmit" class="el-form-block">
        <el-form-item label="邮箱" prop="email">
          <el-input type="text" v-model="user.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button native-type="submit" type="primary" :disabled="disabled" :loading="disabled">登录</el-button>
          <div class="el-form-help">
            <router-link class="pull-left" :to="{ name: 'signup' }">立即注册</router-link>
          </div>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script type="text/babel">
  import { mapActions } from 'vuex'
  import { showNotify } from '../utils'

  export default {
    data() {
      return {
        disabled: false,
        user: {
          email: '',
          password: ''
        },
        rules: {
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '邮箱地址格式不正确', trigger: 'blur,change' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      ...mapActions(['signIn']),
      handleSubmit() {
        this.$refs.user.validate(async(valid) => {
          if (valid) {
            this.disabled = true

            let result = await this.signIn(this.user)
            let next = this.$route.query.next

            this.disabled = false

            showNotify(this, result, ctx => {
              if (next) {
                ctx.$router.push(next)
              } else {
                ctx.$router.push('/')
              }
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>
