<template>
  <el-form :model="field" :rules="rules" ref="field" @submit.native.prevent="handleSubmit">
    <el-form-item prop="description">
      <el-input class="el-input-group-field" v-model="field.description" placeholder="请输字段描述">
        <template slot="prepend">
          {{ name }}
          <el-switch class="el-switch-share" v-model="share" on-text="共享" off-text="私有"></el-switch>
          <el-switch class="el-switch-required" v-model="field.required" on-text="必需" off-text="可选"></el-switch>
        </template>
        <template slot="append">
          <el-button native-type="submit" type="primary" :plain="true">保存</el-button>
        </template>
      </el-input>
    </el-form-item>
  </el-form>
</template>
<style lang="scss" scoped>
  .el-form {
    margin-bottom: 5px;
    overflow: hidden;
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .el-input-group {
    .el-button {
      &:active, &:focus, &:hover {
        border-color: transparent;
      }
    }
  }
  .el-switch {
    position: absolute;
    top: 7px;
    right: 10px;
  }
  .el-switch-required {
    right: 80px;
  }
</style>
<style lang="scss">
  .el-input-group-field .el-input-group__prepend {
    width: 50%;
  }
</style>
<script type="text/babel">
  import { mapGetters, mapActions } from 'vuex'

  export default{
    name: 'el-field-block',
    props: {
      name: String,
      response: Object
    },
    data() {
      return {
        disabled: false,
        share: false,
        field: {
          id: '',
          description: '',
          required: true
        },
        rules: {
          description: [
            { required: true, message: '请输入字段描述', trigger: 'blur' }
          ]
        }
      }
    },
    computed: mapGetters(['project', 'api', 'fields']),
    mounted(){
      this.fields.forEach(field => {
        if (field.name === this.name) {
          this.field = JSON.parse(JSON.stringify(field))
          this.share = this.field.response_id === 0
          this.field.required = !!this.field.required
        }
      })
    },
    methods: {
      ...mapActions(['createField', 'updateField']),
      handleSubmit() {
        this.$refs.field.validate(async(valid) => {
          let result

          if (valid) {
            this.disabled = true
            this.field.name = this.name
            this.field.project_id = this.project.id
            this.field.response_id = this.share ? 0 : this.response.id
            this.field.required = this.field.required ? 1 : 0

            if (this.field.id) {
              result = await this.updateField(this.field)
            } else {
              result = await this.createField(this.field)
            }

            this.disabled = false

            if (result.code === 0) {
              this.$notify.success({
                title: '提示',
                message: '保存成功！',
                duration: 3000
              })
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
      }
    }
  }
</script>
