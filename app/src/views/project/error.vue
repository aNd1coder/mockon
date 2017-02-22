<template>
  <div v-loading.body="loading" element-loading-text="加载中">
    <div class="page-header">
      <h1 class="pull-left">错误码管理</h1>
      <el-button class="pull-right" :plain="true" type="primary" @click="handleCreate">
        <i class="fa fa-plus-circle"></i>新增错误码
      </el-button>
    </div>
    <el-table v-if="errors && errors.length" :data="errors" stripe>
      <el-table-column inline-template prop="user.avatar" label="创建者">
        <el-user-block :user="row.user"></el-user-block>
      </el-table-column>
      <el-table-column prop="code" label="错误码"></el-table-column>
      <el-table-column prop="module_id" label="所属模块" inline-template>
        <div>
        {{ belongTo(row) }}
        </div>
      </el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column v-if="project.owner.id === user.id" inline-template label="操作">
        <div>
          <el-button :plain="true" type="danger" size="small" @click="handleDelete(row)">
            <i class="fa fa-trash-o"></i>删除
          </el-button>
          <el-button :plain="true" size="small" @click="handleUpdate(row)">
            <i class="fa fa-pencil-square-o"></i>编辑
          </el-button>
        </div>
      </el-table-column>
    </el-table>
    <el-nodata v-else></el-nodata>
    <el-dialog :title="title" v-model="dialogVisible">
      <el-form :model="error" :rules="rules" ref="error" @submit.native.prevent="handleSubmit">
        <el-form-item label="错误码" prop="code">
          <el-input type="text" v-model="error.code"></el-input>
        </el-form-item>
        <el-form-item label="错误信息" prop="description">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2 }" v-model="error.description"></el-input>
        </el-form-item>
        <el-form-item prop="type">
          <el-select v-model="error.module_id" placeholder="所属模块">
            <el-option label="全局" value="0" :selected="error.module_id === 0"></el-option>
            <el-option v-for="{ id, name } in modules" :label="name" :value="id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button native-type="submit" type="primary" :disabled="disabled" :loading="disabled">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script type="text/babel">
  import { mapGetters, mapActions } from 'vuex'
  import ElUserBlock from '../../components/user-block.vue'
  import ElNodata from '../../components/nodata.vue'

  export default {
    components: {
      ElUserBlock,
      ElNodata
    },
    data() {
      return {
        title: '',
        dialogVisible: false,
        loading: true,
        disabled: false,
        error: {
          id: '',
          type: 0,
          code: '',
          description: ''
        },
        rules: {
          code: [
            { required: true, message: '请输入错误码', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入描述', trigger: 'blur' }
          ]
        }
      }
    },
    computed: mapGetters([
      'user',
      'project',
      'modules',
      'errors'
    ]),
    beforeRouteEnter(to, from, next) {
      next(async(vm) => {
        await vm.fetchModules({ project_id: vm.project.id })
        await vm.fetchErrors({ project_id: vm.project.id })
        vm.loading = false
      })
    },
    methods: {
      ...mapActions([
        'fetchModules',
        'fetchErrors',
        'createError',
        'deleteError',
        'updateError'
      ]),
      handleCreate() {
        this.title = '新建错误码'

        this.error = {
          id: '',
          type: 0,
          code: '',
          description: ''
        }

        this.dialogVisible = true
      },
      handleUpdate(row) {
        this.title = '修改错误码'
        this.dialogVisible = true
        this.error = JSON.parse(JSON.stringify(row))
      },
      handleRemove(row){
        this.$confirm(
          '确定删除该错误码？',
          '提示',
          { type: 'warning' }
        ).then(async() => {
          await this.deleteError(row)

          this.$notify.success({
            title: '提示',
            message: '删除成功!',
            duration: 3000
          })
        }).catch(() => {
        })
      },
      handleSubmit() {
        this.$refs.error.validate(async(valid) => {
          let result

          if (valid) {
            this.disabled = true

            this.error.project_id = this.project.id

            if (this.error.id) {
              result = await this.updateError(this.error)
            } else {
              result = await this.createError(this.error)
            }

            this.disabled = false

            if (result.code === 0) {
              this.$notify.success({
                title: '提示',
                message: '保存成功！',
                duration: 3000
              })

              this.dialogVisible = false
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
      },
      belongTo(row) {
        let matched = this.modules.find(module => {
          return module.id === row.module_id
        })

        return matched ? matched.name : '全局'
      }
    }
  }
</script>
