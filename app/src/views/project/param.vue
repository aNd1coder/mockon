<template>
  <el-form class="el-form-param" :inline="true" :model="param" :rules="rules" ref="param" @submit.native.prevent="handleSubmit">
    <el-form-item prop="name">
      <el-autocomplete
        class="param-autocomplete"
        custom-item="param-item"
        placeholder="名称"
        v-model="param.name"
        :fetch-suggestions="querySearch"
        @select="handleSelect"
      >
      </el-autocomplete>
    </el-form-item>
    <el-form-item prop="type">
      <el-select v-model="param.type" placeholder="类型">
        <el-option v-for="type in PARAM_TYPE" :key="type" :label="type" :value="type"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="location">
      <el-select v-model="param.location" placeholder="位置">
        <el-option v-for="(label, value) in PARAM_LOCATION" :key="value" :label="label" :value="value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="length">
      <el-input type="text" v-model="param.length" placeholder="长度"></el-input>
    </el-form-item>
    <el-form-item prop="default_value">
      <el-input type="text" v-model="param.default_value" placeholder="默认值"></el-input>
    </el-form-item>
    <el-form-item prop="description">
      <el-input type="textarea" :rows="1" :autosize="{ minRows: 1, maxRows: 99}" v-model="param.description" placeholder="描述(markdown)"></el-input>
    </el-form-item>
    <el-form-item class="el-form-required" prop="required">
      <el-switch v-model="param.required" on-text="必选" off-text="可选"></el-switch>
    </el-form-item>
    <el-form-item class="el-form-button">
      <el-button :disabled="!param.id" :plain="true" type="danger" size="small" @click="handleDelete()">删除</el-button>
    </el-form-item>
    <el-form-item>
      <el-button :plain="true" :disabled="disabled" size="small" @click="handleSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>
<script type="text/babel">
  import Vue from 'vue'
  import { mapGetters, mapActions } from 'vuex'
  import { showNotify, showConfirm } from '../../utils'
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
    name: 'el-param',
    props: {
      response: Object,
      data: Object
    },
    data() {
      return {
        PARAM_TYPE,
        PARAM_LOCATION,
        disabled: false,
        newParam: {},
        param: {
          id: '',
          name: '',
          type: 'string',
          location: 'query',
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
      'api',
      'params'
    ]),
    mounted() {
      this.newParam = JSON.parse(JSON.stringify(this.param))

      if (this.data && this.data.id) {
        this.param = JSON.parse(JSON.stringify(this.data))
        this.param.required = !!this.param.required
      }
    },
    methods: {
      ...mapActions([
        'fetchParam',
        'createParam',
        'deleteParam',
        'updateParam',
      ]),
      handleSelect(item) {
        if (this.param.id === '') { // 第一次选
          delete item.id
          delete item.created_at
          delete item.modified_at

          this.param = JSON.parse(JSON.stringify(item))
        }
      },
      handleDelete() {
        showConfirm(this, '确定删除该参数?', async (ctx) => {
          let result = await ctx.deleteParam(ctx.data)
          showNotify(ctx, result)
        })
      },
      handleSubmit() {
        this.$refs.param.validate(async (valid) => {
          if (valid) {
            let result

            this.disabled = true

            if (this.param.id) {
              result = await this.updateParam(this.param)
            } else {
              if (!this.response.id) {
                this.$message.error('请先保存响应信息')
                this.disabled = false
                return false
              }

              this.param.project_id = this.project.id
              this.param.api_id = this.api.id
              this.param.response_id = this.response.id

              result = await this.createParam(this.param)
            }

            if (this.param.id) {
              this.param = JSON.parse(JSON.stringify(this.param))
            } else {
              this.param = JSON.parse(JSON.stringify(this.newParam));
            }

            this.disabled = false

            showNotify(this, result)
          }
        })
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

    .el-input__inner, .el-textarea__inner {
      padding: 3px 0;
      border-color: #fff;
      border-radius: 0;
      resize: none;

      &:hover, &:focus {
        border-color: #fff #fff #20a0ff #fff !important;
      }
    }
  }
  .el-autocomplete-suggestion {
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
