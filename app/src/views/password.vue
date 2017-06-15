<template>
  <el-row type="flex">
    <el-col :span="8" :offset="8">
      <el-form :model="user" ref="user" @submit.native.prevent="handleSubmit" class="el-form-block">
        <el-form-item label="输入你的邮箱地址，我们会为你发送密码重置链接" prop="email">
          <el-input type="text" v-model="user.email" placeholder="输入你的邮箱地址"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button native-type="submit" type="primary" :disabled="disabled" :loading="disabled">发送密码重置邮件</el-button>
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
          email: ''
        }
      }
    },
    methods: {
      ...mapActions(['passwordReset']),
      handleSubmit() {
        this.$refs.user.validate(async(valid) => {
          if (valid) {
            this.disabled = true

            let result = await this.passwordReset(this.user)

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
