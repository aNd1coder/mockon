<template>
  <el-form class="el-form-param" :inline="true" :model="param" :rules="rules" ref="param" @submit.native.prevent="handleSubmit">
    <el-form-item prop="name">
      <el-autocomplete
        class="param-autocomplete"
        custom-item="param-item"
        placeholder="参数名称"
        v-model="param.name"
        :fetch-suggestions="querySearch"
        @select="handleSelect"
      >
      </el-autocomplete>
    </el-form-item>
    <el-form-item prop="type">
      <el-select v-model="param.type" placeholder="参数类型">
        <el-option v-for="type in PARAM_TYPE" :label="type" :value="type"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="location">
      <el-select v-model="param.location" placeholder="参数位置">
        <el-option v-for="(label, value) in PARAM_LOCATION" :label="label" :value="value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="length">
      <el-input type="text" v-model="param.length" placeholder="参数长度"></el-input>
    </el-form-item>
    <el-form-item prop="default_value">
      <el-input type="text" v-model="param.default_value" placeholder="默认值"></el-input>
    </el-form-item>
    <el-form-item prop="description">
      <el-input type="text" v-model="param.description" placeholder="参数描述"></el-input>
    </el-form-item>
    <el-form-item class="el-form-required" prop="required">
      <el-switch v-model="param.required" on-text="必选" off-text="可选"></el-switch>
    </el-form-item>
    <el-form-item class="el-form-button" v-if="project.owner.id === user.id">
      <el-button v-if="param.id || !isLast" :plain="true" type="danger" size="small" @click="handleDelete(isLast)">删除</el-button>
      <el-button v-else :plain="true" type="danger" size="small" @click="handleCreate">新增</el-button>
    </el-form-item>
    <el-form-item v-if="project.owner.id === user.id">
      <el-button :plain="true" :disabled="disabled" size="small" @click="handleSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>
<script type="text/babel">
  import Vue from 'vue'
  import { mapGetters, mapActions } from 'vuex'
  import { PARAM_TYPE, PARAM_LOCATION } from '../../config'

  Vue.component('param-item', {
    functional: true,
    render: function (h, ctx) {
      var item = ctx.props.item
      return h('li', ctx.data, [
        h('div', { attrs: { class: 'name' } }, [item.name]),
        h('div', { attrs: { class: 'meta' } }, [item.description]), // + ' ' + item.type + (item.length !== '' ? `(${item.length})` : '')
      ])
    },
    props: {
      item: { type: Object, required: true }
    }
  })

  export default {
    props: {
      response: Object,
      isLast: Boolean,
      data: Object
    },
    data() {
      return {
        PARAM_TYPE,
        PARAM_LOCATION,
        disabled: false,
        param: {
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
      'user',
      'project',
      'api',
      'params'
    ]),
    watch: {
      api: {
        handler: 'loadData',
        deep: true
      }
    },
    mounted() {
      this.loadData()
    },
    methods: {
      ...mapActions([
        'fetchParam',
        'createParam',
        'deleteParam',
        'updateParam',
        'appendApiResponseParam',
        'deleteApiResponseParam'
      ]),
      handleSelect(item) {
        if (this.param.id === '') {
          delete item.id
          delete item.created_at
          delete item.modified_at

          this.param = JSON.parse(JSON.stringify(item))
        }
      },
      handleCreate() {
        this.appendApiResponseParam({
          param_id: new Date().getTime(),
          name: '',
          type: '',
          length: '',
          default_value: '',
          required: false,
          description: '',
          api_id: this.api.id,
          response_id: this.response.id
        })
      },
      handleDelete() {
        if (this.data.id) {
          this.$confirm(
            '确定删除该字段?',
            '提示',
            { type: 'warning' }
          ).then(async() => {
            await this.deleteParam(this.data)

            this.$notify.success({
              title: '提示',
              message: '删除成功!',
              duration: 3000
            })
          }).catch(() => {
          })
        } else {
          this.deleteApiResponseParam(this.data)
        }
      },
      handleSubmit() {
        this.$refs.param.validate(async(valid) => {
          if (valid) {
            let result

            this.disabled = true

            if (this.param.id) {
              result = await this.updateParam(this.param)
            } else {
              this.param.project_id = this.project.id
              this.param.api_id = this.api.id
              this.param.response_id = this.response.id

              result = await this.createParam(this.param)
            }

            delete this.param.param_id

            this.param = JSON.parse(JSON.stringify(this.param))
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
          }
        })
      },
      loadData() {
        if (this.data && this.data.id) {
          this.param = JSON.parse(JSON.stringify(this.data))
          this.param.required = !!this.param.required
        }
      },
      querySearch(queryString, callback) {
        let params = this.params
        let results = queryString ? params.filter(this.createFilter(queryString)) : params
        callback(results)
      },
      createFilter(queryString) {
        return (param) => {
          return (param.name.indexOf(queryString.toLowerCase()) === 0)
        }
      }
    }
  }
</script>
<style lang="scss">
  .el-form-param {
    display: flex;
    border-bottom: 1px solid #eeeeee;
    padding: 0 !important;
    margin-bottom: 0 !important;
    background-color: transparent !important;

    .el-form-item {
      margin: 0;

      &.is-error .el-input__inner {
        border-color: #fff #fff #ff4949 #fff !important;
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
  .el-autocomplete__suggestions {
    max-height: 230px;

    li {
      line-height: normal;
      padding: 5px;
    }

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .meta {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .meta {
      color: #ddd;
    }
  }
</style>
