<template>
  <el-table v-if="documents && documents.length" :data="documents" stripe>
    <el-table-column inline-template prop="user.avatar" label="创建者">
      <el-user-block :user="row.user"></el-user-block>
    </el-table-column>
    <el-table-column prop="api.name" label="名称"></el-table-column>
    <el-table-column prop="status" label="状态" :filters="statusMap" :filter-method="filterStatus" inline-template>
      <el-tag :type="row.status === 0 ? 'gray' : 'primary'" close-transition>
        {{ statusMap[row.status].text }}
      </el-tag>
    </el-table-column>
    <el-table-column sortable :formatter="formatter" prop="created_at" width="170" label="创建时间"></el-table-column>
    <el-table-column sortable :formatter="formatter" prop="modified_at" width="170" label="最后更新"></el-table-column>
    <el-table-column v-if="project.owner.id === user.id" width="165" inline-template label="操作">
      <div>
        <el-button :plain="true" type="danger" size="small" @click="handleRemove(row)">
          <i class="fa fa-trash-o"></i>删除
        </el-button>
        <router-link :to="{ name: 'project-editor', params: { code: project.code, api_id: row.api_id } }">
          <el-button :plain="true" type="warning" size="small">
            <i class="fa fa-pencil-square-o"></i>编辑
          </el-button>
        </router-link>
      </div>
    </el-table-column>
  </el-table>
  <el-nodata v-else></el-nodata>
</template>
<script type="text/babel">
  import { mapGetters, mapActions } from 'vuex'
  import { dateFormatter } from '../../utils'
  import ElUserBlock from '../../components/user-block.vue'
  import ElNodata from '../../components/nodata.vue'

  export default {
    components: {
      ElUserBlock,
      ElNodata
    },
    data() {
      return {
        statusMap: [
          { text: '草稿', value: '0' },
          { text: '发布', value: '1' },
          { text: '废弃', value: '2' },
        ]
      }
    },
    computed: mapGetters(['user', 'project', 'documents']),
    beforeRouteEnter({ params: { code } }, from, next) {
      next(async(vm) => {
        await vm.fetchProject({ code })
        await vm.fetchDocuments({ project_id: vm.project.id })
      })
    },
    methods: {
      ...mapActions(['fetchProject', 'fetchDocuments', 'deleteDocument']),
      handleRemove(row) {
        this.$confirm(
          '确定删除该文档?',
          '提示',
          { type: 'warning' }
        ).then(async() => {
          await this.deleteDocument(row)

          this.$notify.success({
            title: '提示',
            message: '删除成功!',
            duration: 3000
          })
        }).catch(() => {})
      },
      handleDeprecated(row) {
        this.$confirm(
          '确定废弃该文档?',
          '提示',
          { type: 'warning' }
        ).then(async() => {
          await this.deleteDocument(row)

          this.$notify.success({
            title: '提示',
            message: '废弃成功!',
            duration: 3000
          })
        }).catch(() => {})
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
