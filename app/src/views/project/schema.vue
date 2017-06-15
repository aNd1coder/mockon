<template>
  <div>
    <div class="page-header">
      <h1 class="pull-left">数据库管理</h1>
      <el-button class="pull-right" :plain="true" type="primary" @click="handleCreate">
        <i class="fa fa-plus-circle"></i>新增数据库
      </el-button>
    </div>
    <el-table v-if="databases && databases.length" :data="databases" stripe>
      <el-table-column inline-template prop="user.avatar" label="创建者">
        <el-user-block :user="row.user"></el-user-block>
      </el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="datasource" label="数据源类型"></el-table-column>
      <el-table-column prop="status" label="状态" :filters="statusMap" :filter-method="filterStatus" inline-template>
        <el-tag :type="row.status === 0 ? 'danger' : 'primary'" close-transition>
          {{ statusMap[row.status].text }}
        </el-tag>
      </el-table-column>
      <el-table-column sortable :formatter="formatter" prop="created_at" width="170" label="添加时间"></el-table-column>
      <el-table-column sortable :formatter="formatter" prop="modified_at" width="170" label="最后更新"></el-table-column>
      <el-table-column width="165" fixed="right" inline-template label="操作">
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
      <el-form :model="database" :rules="rules" ref="database" @submit.native.prevent="handleSubmit">
        <el-form-item label="数据库名称" prop="name">
          <el-input type="text" v-model="database.name"></el-input>
        </el-form-item>
        <el-form-item label="数据库描述" prop="description">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2 }" v-model="database.description"></el-input>
        </el-form-item>DATA_SOURCE
        <el-form-item prop="datasource">
          <el-select v-model="database.datasource" placeholder="数据源类型">
            <el-option v-for="source in DATA_SOURCE" :key="source" :label="source" :value="source"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="database.status" placeholder="状态">
            <el-option v-for="status in statusMap" :key="status.value" :label="status.text" :value="status.value"></el-option>
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
  import { DATA_SOURCE } from '../../config'
  import { dateFormatter, showNotify, showConfirm } from '../../utils'

  export default {
    components: {
      ElUserBlock,
      ElNodata
    },
    data() {
      return {
        DATA_SOURCE,
        title: '',
        dialogVisible: false,
        disabled: false,
        statusMap: [
          { text: '开发中', value: '0' },
          { text: '使用中', value: '1' },
          { text: '已废弃', value: '2' }
        ],
        database: {
          id: '',
          name: '',
          description: '',
          datasource: '',
          status: 0
        },
        rules: {
          name: [
            { required: true, message: '请输入数据库名称', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入数据库描述', trigger: 'blur' }
          ]
        }
      }
    },
    computed: mapGetters([
      'session',
      'project',
      'databases'
    ]),
    methods: {
      ...mapActions([
        'fetchDatabase',
        'createDatabase',
        'deleteDatabase',
        'updateDatabase',
      ]),
      handleCreate() {
        this.title = '新建数据库'

        this.database = {
          id: '',
          name: '',
          description: '',
          status: 0
        }

        this.dialogVisible = true
      },
      handleUpdate(row) {
        this.title = '修改数据库'
        this.dialogVisible = true
        this.database = JSON.parse(JSON.stringify(row))
      },
      handleDelete(row) {
        showConfirm(this, '确定删除该数据库?', async (ctx) => {
          let result = await ctx.deleteDatabase(row)
          showNotify(ctx, result)
        })
      },
      handleSubmit() {
        this.$refs.database.validate(async(valid) => {
          let result

          if (valid) {
            this.disabled = true

            this.database.project_id = this.project.id

            if (this.database.id) {
              delete this.database.user
              delete this.database.table
              delete this.database.created_at
              delete this.database.modified_at

              result = await this.updateDatabase(this.database)
            } else {
              result = await this.createDatabase(this.database)
            }

            this.disabled = false

            showNotify(this, result, ctx => {
              ctx.dialogVisible = false
            })
          } else {
            return false
          }
        })
      },
      filterStatus(value, row) {
        return row.status === value
      },
      formatter(row, column) {
        return dateFormatter(row[column.property])
      }
    },
  }
</script>
