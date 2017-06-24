<template>
  <el-row type="flex">
    <el-col v-if="notifications.length > 0" :span="14" :offset="5">
      <h4>全部消息</h4>
      <ul class="notifications">
        <li class="notification" v-for="notification in notifications" :key="notification.id">
          <router-link :to="{ name: 'user', params: { username: notification.user.username } }">
            {{ notification.author | displayName }}
          </router-link>
          在
          <router-link class="name" :to="{ name: 'project-dashboard', params: { code: notification.project.code } }">
            {{ notification.project.name }}
          </router-link>
          <span class="action">{{ notification.action }}</span>
          <span class="description">{{ notification.description }}</span>
        </li>
      </ul>
    </el-col>
    <el-nodata v-else message="暂无消息"></el-nodata>
  </el-row>
</template>
<script type="text/babel">
  import { mapGetters, mapActions } from 'vuex'
  import ElNodata from '../../components/nodata.vue'

  export default{
    components: { ElNodata },
    computed: mapGetters(['notifications']),
    beforeRouteEnter(to, from, next) {
      next(async (vm) => {
        vm.fetchNotifications()
      })
    },
    methods: mapActions(['fetchNotifications'])
  }
</script>
<style lang="scss" scoped>
  h4 {
    margin-top: 20px;
  }
  .el-button {
    display: block;
    margin-top: 20px;
    width: 100%;
  }
  .notifications a {
    color: #20a0ff;
  }
  .notification {
    padding: 20px 0;
    border-bottom: 1px solid #eee;
    font-size: 14px;
  }
</style>
