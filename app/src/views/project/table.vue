<template>
  <div>
    <div class="page-header">
      <h1 class="pull-left">数据表管理</h1>
      <el-button class="pull-right" :plain="true" type="primary" @click="handleCreate">
        <i class="fa fa-plus-circle"></i>新增数据表
      </el-button>
    </div>
    <el-table v-if="tables && tables.length" :data="tables" stripe>
      <el-table-column inline-template prop="user.avatar" label="创建者">
        <el-user-block :user="row.user"></el-user-block>
      </el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="row.status" label="状态" :filters="statusMap" :filter-method="filterStatus" inline-template>
        <el-tag :type="row.status === 0 ? 'danger' : 'primary'" close-transition>
          {{ statusMap[row.status].text }}
        </el-tag>
      </el-table-column>
      <el-table-column sortable :formatter="formatter" prop="created_at" width="170" label="添加时间"></el-table-column>
      <el-table-column sortable :formatter="formatter" prop="modified_at" width="170" label="最后更新"></el-table-column>
      <el-table-column fixed="right" inline-template label="操作">
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
      <el-form :model="table" :rules="rules" ref="table" @submit.native.prevent="handleSubmit">
        <el-form-item label="数据表名称" prop="name">
          <el-input type="text" v-model="table.name"></el-input>
        </el-form-item>
        <el-form-item label="数据表描述" prop="description">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2 }" v-model="table.description"></el-input>
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="table.status" placeholder="状态">
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
  import { dateFormatter, showNotify, showConfirm } from '../../utils'

  export default {
    components: {
      ElUserBlock,
      ElNodata
    },
    data() {
      return {
        title: '',
        dialogVisible: false,
        disabled: false,
        database: {},
        tables: [],
        statusMap: [
          { text: '开发中', value: '0' },
          { text: '使用中', value: '1' }
        ],
        table: {
          id: '',
          name: '',
          description: '',
          status: 0
        },
        rules: {
          name: [
            { required: true, message: '请输入数据表名称', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入数据表描述', trigger: 'blur' }
          ]
        }
      }
    },
    computed: mapGetters([
      'session',
      'project',
      'databases'
    ]),
    watch: {
      $route: 'loadTables'
    },
    beforeRouteEnter(to, from, next) {
      next(async(vm) => {
        vm.loadTables()
      })
    },
    methods: {
      ...mapActions([
        'createTable',
        'deleteTable',
        'updateTable'
      ]),
      handleCreate() {
        this.title = '新建数据表'

        this.table = {
          id: '',
          name: '',
          description: '',
          status: 0
        }

        this.dialogVisible = true
      },
      handleUpdate(row) {
        this.title = '修改数据表'
        this.dialogVisible = true
        this.table = JSON.parse(JSON.stringify(row))
      },
      handleDelete(row) {
        showConfirm(this, '确定删除该数据表?', async (ctx) => {
          let result = await ctx.deleteTable(row)
          showNotify(ctx, result)
        })
      },
      handleSubmit() {
        this.$refs.table.validate(async(valid) => {
          let result

          if (valid) {
            this.disabled = true

            this.table.database_id = this.database.id

            if (this.database.id) {
              delete this.table.user
              delete this.table.created_at
              delete this.table.modified_at

              result = await this.updateTable(this.table)
            } else {
              result = await this.createTable(this.table)
            }

            this.disabled = false

            showNotify(this, result)
          } else {
            return false
          }
        })
      },
      loadTables() {
        this.databases.forEach(database => {
          if (database.name === this.$route.params.database_name) {
            this.database = database
            this.tables = database.table
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
