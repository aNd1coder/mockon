<template>
  <section class="project-member" v-loading.body="loading" element-loading-text="加载中">
    <div class="page-header">
      <h1 class="pull-left">成员管理</h1>
    </div>
    <span v-for="member in members" :key="member.id" class="member">
      <el-user-block :size="80" :user="member.user"></el-user-block>
      <el-tag v-if="member.user.id === project.owner.id" type="primary">Owner</el-tag>
      <el-button v-else :plain="true" type="danger" size="small" @click="handleDelete(member)">移出</el-button>
    </span>
    <span class="new-member" @click="handleInvite" title="添加成员"><i class="fa fa-plus-circle"></i></span>
    <el-dialog title="邀请成员" v-model="dialogVisible">
      <el-form @submit.native.prevent="handleSubmit">
        <el-form-item>
          <el-select v-model="ids" multiple filterable remote placeholder="输入关键词" :remote-method="querySearchAsync">
            <el-option v-for="user in membersData" :key="user.id" :label="user.email" :value="user.id">
              <el-user-block :user="user"></el-user-block>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">发送邀请</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>
<script type="text/babel">
  import { mapGetters, mapActions } from 'vuex'
  import ElUserBlock from '../../components/user-block.vue'
  import { dateFormatter, showNotify, showConfirm } from '../../utils'
  export default {
    components: {
      ElUserBlock
    },
    data() {
      return {
        loading: true,
        dialogVisible: false,
        ids: [],
        membersData: []
      }
    },
    computed: mapGetters(['session', 'users', 'project', 'members']),
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
        await this.fetchUsers({ action: 'invite', project_id: this.project.id })
        this.dialogVisible = true
      },
      handleDelete(member) {
        showConfirm(this, '确定移出该成员?', async (ctx) => {
          let result = await ctx.deleteMember(member)
          showNotify(ctx, result)
        })
      },
      handleSubmit() {
        if (this.ids.length > 0) {
          this.ids.forEach(async (user_id) => {
            let result = await this.inviteMember({ project_id: this.project.id, user_id })
            showNotify(this, result)
          })

          this.ids = []
          this.dialogVisible = false
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
      formatter(row, column) {
        return dateFormatter(row[column.property])
      }
    }
  }
</script>
<style lang="scss">
  .project-member {
    .member,.new-member {
      display: inline-block;
      margin: 20px 0 0 20px;
      text-align: center;
      vertical-align: top;
    }
    .member {
      .el-button, .el-tag {
        display: block;
        width: 100%;
        margin: 5px auto 0;
        font-size: 14px;
      }
      .el-tag {
        height: 28px;
        line-height: 28px;
      }
    }
    .el-user-avatar {
      width: 80px;
      height: 80px;

      &:before {
        font-size: 80px;
      }
    }
    .el-user-name {
      margin-top: 10px;
      font-size: 14px;
    }
    .new-member {
      position: relative;
      width: 80px;
      height: 140px;
      line-height:140px;
      font-size: 30px;
      border: 1px dashed #d9d9d9;
      border-radius: 5px;
      color: #d9d9d9;
      cursor: pointer;

      &:hover {
        color: #20a0ff;
        border-color: #20a0ff;
      }
    }
  }

  .el-select-dropdown__item {
    position: relative;
    height: auto;
  }
</style>
