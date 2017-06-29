<template>
  <section class="project-member" v-loading.fullscreen.lock="loading">
    <div class="page-header">
      <h1 class="pull-left">成员管理</h1>
    </div>
    <span v-for="member in members" :key="member.id" :class="'member' + (member.user_id === project.user_id ? '' : ' member-item')">
      <el-user-block :size="80" :user="member.user"></el-user-block>
      <el-tag :type="isAdmin(member) ? (isOwner(member) ? 'success' : 'primary') : 'gray'">{{ isAdmin(member) === 1 ? (isOwner(member) ? 'Owner' : '管理员') : '成员' }}</el-tag>
      <span v-if="!isOwner(member)" class="member-btn">
        <el-button :plain="true" type="primary" size="small" @click="handleUpdate(member)">{{ member.is_owner ? '取消管理员' : '设为管理员' }}</el-button>
        <el-button :plain="true" type="danger" size="small" @click="handleDelete(member)">移出该成员</el-button>
      </span>
    </span>
    <span class="new-member" @click="handleInvite" title="添加成员"><i class="fa fa-plus-circle"></i></span>
    <el-dialog title="邀请成员" v-model="dialogVisible">
      <el-form @submit.native.prevent="handleSubmit">
        <el-form-item>
          <el-select v-model="ids" multiple filterable remote placeholder="输入关键词" :remote-method="querySearchAsync">
            <el-option v-for="user in membersData" :key="user.id" :label="user.email" :value="user.id">
              <el-user-block :user="user" :disableRoute="true"></el-user-block>
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
  import { showNotify, showConfirm } from '../../utils'
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
    beforeRouteEnter(to, from, next) {
      next(async (vm) => {
        vm.loading = true
        await vm.fetchMembers({ project_id: vm.project.id })
        vm.loading = false
      })
    },
    methods: {
      ...mapActions([
        'fetchMembers',
        'fetchUsers',
        'deleteMember',
        'createMember',
        'updateMember',
      ]),
      async handleInvite() {
        await this.fetchUsers({ action: 'invite', project_id: this.project.id })
        this.dialogVisible = true
      },
      async handleUpdate(member) {
        let result = await this.updateMember({ ...member, is_owner: member.is_owner ? 0 : 1 })
        showNotify(this, result)
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
            let result = await this.createMember({ project_id: this.project.id, user_id })
            showNotify(this, result)
          })

          this.ids = []
          this.dialogVisible = false
        }
      },
      isOwner(member) {
        return member.user_id === this.project.user_id
      },
      isAdmin(member) {
        return member.is_owner
      },
      querySearchAsync(query) {
        query = query.toLowerCase()

        setTimeout(() => {
          this.membersData = this.users.filter(user => {
            return (user.username || '').toLowerCase().indexOf(query) > -1
              || (user.email || '').toLowerCase().indexOf(query) > -1
              || (user.fullname || '').toLowerCase().indexOf(query) > -1
          })
        }, 200)
      }
    }
  }
</script>
<style lang="scss">
  .project-member {
    .member,.new-member {
      display: inline-block;
      padding: 0 10px;
      margin: 20px 0 0 10px;
      text-align: center;
      vertical-align: top;
    }
    .member {
      .el-button, .el-tag {
        display: block;
        width: 100%;
        margin: 5px auto 0;
        font-size: 12px;
      }

      .el-tag {
        height: 28px;
        line-height: 28px;
      }
    }
    .member-item {
      position: relative;

      &:before {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        content: '';
        background-color: rgba(0, 0, 0, .4);
        z-index: 1;
      }

      &:hover {
        &:before, .member-btn { display: block; }
      }

      .member-btn {
        display: none;
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 2;
        transform: translate(-50%, -50%);
      }
    }
    .el-user-name {
      margin-top: 10px;
      font-size: 14px;
    }
    .new-member {
      position: relative;
      width: 100px;
      height: 138px;
      line-height:138px;
      margin-top: 20px;
      font-size: 40px;
      border: 1px dashed #e6ebf1;
      border-radius: 5px;
      color: #e6ebf1;
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

    .el-user-block {
      width: 40px;
    }
  }
</style>
