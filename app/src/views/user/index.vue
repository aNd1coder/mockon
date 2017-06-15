<template>
  <el-row class="user-index" v-loading.fullscreen.lock="loading" element-loading-text="加载中">
    <div class="page-header">
      <el-user-block :user="user" :size="100" class="avatar"></el-user-block>
      <el-tag type="gray">{{ user.description || '暂无简介信息' }}</el-tag>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="最新动态" name="activity">
        <ul v-if="logs.length" class="el-timeline">
          <li v-for="log in logs" class="el-timeline__item">
            <el-user-block :user="log.user" :size="50" :nameVisible="false"></el-user-block>
            <div class="content">
              <router-link :to="{ name: 'user', params: { username: log.user.username } }">
                {{ log.user | displayName }}
              </router-link>
              于 {{ log.created_at | dateformat }}
              <div class="description">{{ log.description }}</div>
            </div>
          </li>
          <li v-if="more" class="el-timeline__more">
            <span v-if="done"><i class="fa fa-frown-o"></i>没有更多数据了</span>
            <a v-else href="javascript:;" @click="handleTimeline">
              <i class="fa fa-chevron-circle-down"></i>查看更多动态
            </a>
          </li>
        </ul>
        <el-nodata v-else></el-nodata>
      </el-tab-pane>
      <el-tab-pane label="个人项目" name="personal">
        <el-row v-if="activeName === 'personal'" :gutter="20">
          <el-col v-if="projects.length === 0">
            <el-nodata></el-nodata>
          </el-col>
          <el-col v-else :span="6" v-for="project in projects" :key="project.id">
            <el-project-block :project="project"></el-project-block>
          </el-col>
          <el-col v-if="projects.length !== 0 && (session && session.id === user.id)" :span="6">
            <div class="project-plate project-plate-new">
              <router-link class="fa fa-plus-circle" :to="{ name: 'project-new' }" title="新增项目"></router-link>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="参与项目" name="team">
        <el-row v-if="activeName === 'team'" :gutter="20">
          <el-col v-if="projects.length === 0">
            <el-nodata></el-nodata>
          </el-col>
          <el-col v-else v-for="project in projects" :key="project.id" :span="6">
            <el-project-block :project="project"></el-project-block>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </el-row>
</template>
<script type="text/babel">
  import { mapGetters, mapActions } from 'vuex'
  import ElUserBlock from '../../components/user-block.vue'
  import ElProjectBlock from '../../components/project-block.vue'
  import ElNodata from '../../components/nodata.vue'

  export default{
    components: {
      ElUserBlock,
      ElProjectBlock,
      ElNodata
    },
    data() {
      return {
        page: 1,
        limit: 10,
        more: true,
        done: false,
        activeName: 'activity',
        loading: true
      }
    },
    computed: mapGetters([
      'session',
      'user',
      'logs',
      'projects'
    ]),
    watch: {
      $route: 'loadData'
    },
    beforeRouteEnter(to, from, next) {
      next(async(vm) => {
        vm.loadData()
      })
    },
    methods: {
      ...mapActions(['fetchUser', 'fetchLogs', 'fetchProjects']),
      async handleClick(tab, event) {
        this.loading = true

        if (tab.name === 'personal') {
          await  this.fetchProjects({ action: 'personal', user_id: this.user.id })
        } else if (tab.name === 'team') {
          await  this.fetchProjects({ action: 'team', user_id: this.user.id })
        }

        this.loading = false
      },
      async loadData() {
        let username = this.$route.params.username

        this.activeName = 'activity'
        this.loading = true

        await this.fetchUser({ username })
        await this.fetchMoreLogs({ user_id: this.user.id })

        this.loading = false

        if (this.logs.length < this.limit) {
          this.more = false
        }
      },
      async fetchMoreLogs() {
        return await this.fetchLogs({
          user_id: this.user.id,
          page: this.page,
          limit: this.limit
        })
      },
      async handleTimeline() {
        this.page++

        let result = await this.fetchMoreLogs()

        if (result.data.data.length === 0) {
          this.done = true
        }
      }
    }
  }
</script>
<style lang="scss">
  .user-index {
    .page-header {
      border-bottom: none;
      text-align: center;

      .el-user-block {
        display: block;
        width: 100px;
        margin: 0 auto;
        cursor: default;
      }

      .el-user-avatar {
        width:100px;
        height: 100px;

        &:before {
          font-size: 110px;
        }
      }

      .el-user-name {
        color: #333;
        font-size: 24px;
        font-weight: 700;
      }

      .el-tag--gray {
        margin-top: 10px;
        padding-left: 10px;
        padding-right: 10px;
      }
      .description {
        font-size: 14px;
        color: #666;
      }
      .owner {
        font-size: 14px;
        color: #999;
        font-weight: 400;
        vertical-align: middle;
      }
    }
    .el-tabs {
      display: block;
      background-color: #fafafa;
    }
    .el-tabs__header {
      text-align: center;
    }
    .el-tabs__nav {
      float: none;
      display: inline-block;
    }
    .el-tabs__item.is-active {
      background-color: transparent;
    }
    .el-timeline {
      border-left: 1px solid #e0e0e0;
    }
    .el-timeline__item {
      position: relative;
      padding: 0 0 20px 20px;
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
        margin-top: 5px;
        font-size: 14px;
        color: #333;
      }

      &:before {
        position: absolute;
        width: 6px;
        height: 6px;
        border: 3px solid #f3f3f3;
        top: 16px;
        left: -6px;
        border-radius: 50%;
        content: '';
        background-color: #cfcfcf;
      }

      &:first-child:before {
        border: 3px solid #d6edfe;
        background-color: #20a0ff;
      }

      a {
        color: #333;
      }
    }
    .el-timeline__more {
      padding-left: 30px;
      color: #999;

      &, a {
        font-size: 14px;
      }

      a {
        color: #20a0ff;
      }
    }
  }
</style>
