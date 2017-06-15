<template>
  <el-form class="el-form-error" :model="error" :rules="rules" ref="error" :inline="true" @submit.native.prevent="handleSubmit">
    <el-form-item prop="name">
      <el-input type="text" v-model="error.name" placeholder="状态名称(英文)"></el-input>
    </el-form-item>
    <el-form-item prop="code">
      <el-input type="text" v-model="error.code" placeholder="状态代码"></el-input>
    </el-form-item>
    <el-form-item class="el-form-item-description" prop="description">
      <el-input type="text" v-model="error.description" placeholder="状态描述"></el-input>
    </el-form-item>
    <el-form-item prop="type">
      <el-switch v-model="share" on-text="全局" off-text="私有"></el-switch>
    </el-form-item>
    <el-form-item class="el-form-button">
      <el-button :disabled="!error.id" :plain="true" type="danger" size="small" @click="handleDelete()">删除</el-button>
    </el-form-item>
    <el-form-item>
      <el-button :plain="true" :disabled="disabled" size="small" @click="handleSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>
<script type="text/babel">
  import { mapGetters, mapActions } from 'vuex'
  import { showNotify, showConfirm } from '../../utils'

  export default {
    name: 'el-error',
    props: {
      data: Object
    },
    data() {
      return {
        loading: true,
        disabled: false,
        share: false,
        newError: {},
        error: {
          id: '',
          name:'',
          code: '',
          description: ''
        },
        rules: {
          code: [
            { required: true, message: '请输入状态码', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入描述', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'session',
        'project',
        'api'
      ])
    },
    mounted() {
      this.loading = false
      this.newError = JSON.parse(JSON.stringify(this.error))

      if (this.data && this.data.id) {
        this.error = JSON.parse(JSON.stringify(this.data))
        this.share = this.error.api_id === 0
      }
    },
    methods: {
      ...mapActions([
        'createError',
        'deleteError',
        'updateError',
        'appendApiError',
        'deleteApiError',
      ]),
      handleDelete(){
        showConfirm(this, '确定删除该状态码?', async (ctx) => {
          let result = await ctx.deleteError(ctx.data)
          showNotify(ctx, result)
        })
      },
      handleSubmit() {
        this.$refs.error.validate(async (valid) => {
          let result

          if (valid) {
            this.disabled = true

            this.error.project_id = this.project.id

            if (this.share) {
              this.error.api_id = 0;
            } else {
              this.error.api_id = this.api.id
            }

            if (this.error.id) {
              result = await this.updateError(this.error)
            } else {
              result = await this.createError(this.error)
            }

            if (this.error.id) {
              this.error = JSON.parse(JSON.stringify(this.error))
            } else {
              this.error = JSON.parse(JSON.stringify(this.newError))
            }

            this.disabled = false

            showNotify(this, result)
          } else {
            return false
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .el-form-error {
    display: flex;
    border-bottom: 1px solid #eeeeee;
    padding: 0 !important;
    margin-bottom: 0 !important;
    background-color: transparent !important;

    .el-form-item {
      margin: 0;

      &:nth-child(1) {
        width: 25%;
      }

      &:nth-child(2) {
        width: 15%;
      }

      &.is-error .el-input__inner {
        border-color: #fff #fff #ff4949 #fff !important;
      }
    }

    .el-form-item-description {
      width: 70%;

      .el-form-item__content {
        display: block;
      }
    }

    .el-form-required {
      margin-left: 10px;
    }

    .el-form-button {
      margin: 0 10px;
    }

    .el-input__inner {
      padding: 3px 0;
      border-color: #fff;
      border-radius: 0;

      &:hover, &:focus {
        border-color: #fff #fff #20a0ff #fff !important;
      }
    }
  }
</style>
