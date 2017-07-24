<template>
  <el-row type="flex" v-loading.fullscreen.lock="loading">
    <el-col v-if="logs.length > 0" :span="14" :offset="5">
      <h4>全部消息</h4>
      <ul v-if="logs.length" class="el-timeline">
        <li v-for="log in logs" class="el-timeline__item">
          <el-user-block :user="log.user" :size="40" :fontSize="50" :nameVisible="false"></el-user-block>
          <div class="content">
            <router-link :to="{ name: 'user', params: { username: log.user.username } }">
              {{ log.user | displayName }}
            </router-link>
            于 {{ log.created_at | dateformat }}
            <div class="description">
              {{ log.description }}，<router-link :to="{ name: 'project-dashboard', params: { code: log.project.code } }">查看</router-link>
            </div>
          </div>
        </li>
        <li v-if="more" class="el-timeline__more">
          <el-button v-if="!done" @click="handleLoadMore">加载更多</el-button>
        </li>
      </ul>
      <el-nodata v-else></el-nodata>
    </el-col>
  </el-row>
</template>
<script type="text/babel">
  import { mapGetters, mapActions } from 'vuex'
  import ElUserBlock from '../../components/user-block.vue'
  import ElNodata from '../../components/nodata.vue'

  export default{
    components: {
      ElUserBlock,
      ElNodata
    },
    data() {
      return {
        page: 1,
        limit: 20,
        more: true,
        done: false,
        loading: true
      }
    },
    computed: mapGetters(['logs']),
    beforeRouteEnter(to, from, next) {
      next(async (vm) => {
        await vm.loadData()
      })
    },
    methods: {
      ...mapActions(['fetchLogs','mutateHasUreadNotification']),
      async handleLoadMore() {
        this.page++

        let result = await this.fetchMoreLogs()

        if (result.data.data.length === 0) {
          this.done = true
        }
      },
      async loadData() {
        await this.fetchMoreLogs()

        this.mutateHasUreadNotification(0)
        this.loading = false

        if (this.logs.length < this.limit) {
          this.more = false
        }
      },
      async fetchMoreLogs() {
        return await this.fetchLogs({ action: 'notification', page: this.page, limit: this.limit })
      }
    }
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
  .el-timeline__item {
    position: relative;
    padding-top: 20px;
    font-size: 12px;
    color: #999;

    .el-user-block {
      float: left;
      margin-right: 15px;
    }

    .content {
      overflow: hidden;
    }

    .description {
      margin-top: 3px;
      font-size: 14px;
      color: #333;

      a {
        color: #20a0ff;
      }
    }

    a {
      color: #333;
    }
  }
  .el-timeline__more {
    padding: 30px 0;
  }
</style>
