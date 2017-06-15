<template>
  <el-form :inline="true" :model="field" :rules="rules" ref="field" @submit.native.prevent="handleSubmit">
    <el-form-item prop="name">
      <el-input type="text" v-model="field.name" placeholder="名称"></el-input>
    </el-form-item>
    <el-form-item prop="type">
      <el-select v-model="field.type" placeholder="类型">
        <el-option v-for="type in FIELD_TYPE" :key="type" :label="type" :value="type"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="length">
      <el-input type="text" v-model="field.length" placeholder="长度"></el-input>
    </el-form-item>
    <el-form-item prop="default_value">
      <el-input type="text" v-model="field.default_value" placeholder="默认值"></el-input>
    </el-form-item>
    <el-form-item prop="required">
      <el-switch v-model="this.field.required" on-text="必需" off-text="可选"></el-switch>
    </el-form-item>
    <el-form-item prop="description">
      <el-input type="text" v-model="field.description" placeholder="描述"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button :plain="true" type="danger" size="small" @click="handleDelete(this.field. $index)">
        <i class="fa fa-trash-o"></i>删除
      </el-button>
      <el-button :plain="true" size="small" @click="handleCreate($index)">
        <i class="fa fa-plus-circle"></i>新增
      </el-button>
      <el-button :plain="true" :disabled="disabled" size="small" @click="handleSubmit">
        <i class="fa fa-floppy-o"></i>保存
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script type="text/babel">
  import { mapGetters, mapActions } from 'vuex'
  import { showNotify, showConfirm } from '../../utils'
  import { FIELD_TYPE } from '../../config'

  export default {
    props: {
      data: Object
    },
    data() {
      return {
        FIELD_TYPE,
        disabled: false,
        field: {
          id: '',
          name: '',
          type: '',
          length: '',
          default_value: '',
          required: false,
          description: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入参数名称', trigger: 'blur' }
          ]
        }
      }
    },
    computed: mapGetters([
      'session',
      'project',
      'fetchField',
      'createField',
      'deleteField',
      'updateField'
    ]),
    mounted() {
      this.field = JSON.parse(JSON.stringify(this.data))
      this.field.required = !!this.field.required
    },
    methods: {
      handleDelete() {
        if (this.field.id) {
          showConfirm(this, '确定删除该字段?', async (ctx) => {
            let result = await ctx.deleteField(ctx.field)
            showNotify(ctx, result)
          })
        }
      },
      handleSubmit() {
        this.$refs.project.validate(async(valid) => {
          if (valid) {
            let result

            this.disabled = true
            this.field.required = this.field.required ? 1 : 0

            if (this.field.id) {
              result = await this.updateField(this.field)
            } else {
              this.field.project_id = this.project.id
              this.field.api_id = this.$route.params.api_id
              result = await this.createField(this.field)
            }

            this.disabled = false

            showNotify(this, result)
          }
        })
      }
      ,
    },
  }
</script>
<style lang="scss" scoped>
  .el-form {
    padding: 0;
    background-color: transparent;

    .el-input__inner {
      border-color: #fff;
      padding-left: 5px;
      border-radius: 0;

      &:hover {
        border-color: #20a0ff;
      }
    }
  }
</style>
