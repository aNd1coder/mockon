<template>
  <div v-loading.body="loading" element-loading-text="加载中">
    <div class="page-header">
      <h1 class="pull-left">成员管理</h1>
      <el-button class="pull-right" :plain="true" type="primary" @click="handleInvite">
        <i class="fa fa-user-plus"></i>邀请成员
      </el-button>
    </div>
    <el-table v-if="members && members.length" :data="members" stripe>
      <el-table-column inline-template prop="user.avatar" label="用户">
        <el-user-block :user="row.user"></el-user-block>
      </el-table-column>
      <el-table-column prop="user.username" label="账户"></el-table-column>
      <el-table-column prop="user.email" width="200" label="邮箱"></el-table-column>
      <el-table-column prop="user.mobile" width="125" label="手机"></el-table-column>
      <el-table-column prop="user.status" label="状态" :filters="statusMap" :filter-method="filterStatus" inline-template>
        <el-tag :type="row.user.status === 0 ? 'danger' : 'primary'" close-transition>
          {{ statusMap[row.user.status].text }}
        </el-tag>
      </el-table-column>
      <el-table-column sortable :FORMATTER="formatter" prop="created_at" width="170" label="加入时间"></el-table-column>
      <el-table-column v-if="project.owner.id === user.id" inline-template label="操作">
        <el-button :plain="true" type="danger" size="small" @click="handleremove(row)">移出</el-button>
      </el-table-column>
    </el-table>
    <el-nodata v-else></el-nodata>
    <el-dialog title="邀请成员加入" v-model="dialogVisible">
      <el-form @submit.native.prevent="handleSubmit">
        <el-form-item>
          <el-select
            v-model="ids"
            multiple
            filterable
            remote
            placeholder="输入关键词"
            :remote-method="querySearchAsync">
            <el-option
              v-for="user in membersData"
              :key="user.id"
              :label="user.email"
              :value="user.id">
              <el-user-block :user="user"></el-user-block>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">发送邀请</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script type="text/babel">
  import { mapGetters, mapActions } from 'vuex'
  import ElUserBlock from '../../components/user-block.vue'
  import ElNodata from '../../components/nodata.vue'
  import { dateFormatter } from '../../utils'

  export default {
    components: {
      ElUserBlock,
      ElNodata
    },
    data() {
      return {
        loading: true,
        dialogVisible: false,
        ids: '',
        membersData: [],
        ids: '',
        statusMap: [
          { text: '未确认', value: '0' },
          { text: '已加入', value: '1' },
        ]
      }
    },
    computed: mapGetters(['user', 'users', 'project', 'members']),
    beforeRouteEnter({ params: { code } }, from, next) {
      next(async(vm) => {
        await vm.fetchProject({ code })
        await vm.fetchMembers({ project_id: vm.project.id })
        vm.loading = false
      })
    },
    methods: {
      ...mapActions([
        'fetchProject',
        'fetchMembers',
        'fetchUsers',
        'deleteMember',
        'inviteMember',
      ]),
      async handleInvite() {
        this.dialogVisible = true
        await this.fetchUsers({})
      },
      handleRemove(row) {
        this.$confirm(
          '确定移出该成员?',
          '提示',
          { type: 'warning' }
        ).then(async() => {
          await this.deleteMember(row)

          this.$notify.success({
            title: '提示',
            message: '删除成功!',
            duration: 3000
          })
        }).catch(() => {
        })
      },
      handleSubmit() {
        if (this.ids.length > 0) {
          this.ids.forEach(async(user_id) => {
            await this.inviteMember({ project_id: this.project.id, user_id })
          })

          this.ids = ''

          this.$notify.success({
            title: '提示',
            message: '邀请成功!',
            duration: 3000
          })
        }
      },
      querySearchAsync(query) {
        if (query !== '') {
          query = query.toLowerCase()
          setTimeout(() => {
            this.membersData = this.users.filter(user => {
              return user.email.toLowerCase().indexOf(query) > -1;
            })
          }, 200);
        } else {
          this.membersData = []
        }
      },
      filterStatus(value, row) {
        return row.user.status === value
      },
      formatter(row, column) {
        return dateFormatter(row[column.property])
      }
    },
  }
</script>
