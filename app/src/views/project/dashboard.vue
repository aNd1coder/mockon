<template>
  <el-row v-loading.fullscreen.lock="loading">
    <el-col :span="24">
      <div class="page-header">
        <div class="logo">
          <img v-if="project.image" :src="project.image | imgformat" width="100">
          <span v-else>{{ project.name.charAt(0) }}</span>
        </div>
        <div class="meta">
          <h1 class="name">{{ project.name }}</h1>
          <h2 class="description" v-html="marked(project.description)"></h2>
          <ul class="links">
            <li class="link">
              <router-link :to="{ name: 'user', params: { username: project.owner.username } }">
                {{ project.owner | displayName }}
              </router-link>
              创建于 {{ project.created_at | dateformat }}
            </li>
          </ul>
        </div>
      </div>
      <el-tabs type="card">
        <el-tab-pane label="动态">
          <el-row type="flex">
            <el-col :span="18">
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
            </el-col>
            <el-col :span="6">
              <ul v-if="project.members.length" class="project-members">
                <li>
                  <router-link :to="{ name: 'project-member', params: { code: project.code } }">
                    <h4>成员<i class="fa fa-angle-right pull-right"></i></h4>
                  </router-link>
                </li>
                <li v-for="member in project.members" class="member">
                  <el-user-block :user="member" :size="40" :nameVisible="false"></el-user-block>
                </li>
              </ul>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>
<script type="text/babel">
  import { mapGetters, mapActions } from 'vuex'
  import ElUserBlock from '../../components/user-block.vue'
  import ElNodata from '../../components/nodata.vue'
  import { marked } from '../../utils'

  export default{
    components: {
      ElUserBlock,
      ElNodata
    },
    data() {
      return {
        marked,
        loading: true,
        page: 1,
        limit: 10,
        more: true,
        done: false
      }
    },
    computed: mapGetters(['project', 'logs']),
    watch: {
      project: 'loadData'
    },
    beforeRouteEnter(to, from, next) {
      next(async (vm) => {
        vm.loading = true
        await vm.loadData()
        vm.loading = false
      })
    },
    methods: {
      ...mapActions(['fetchLogs']),
      async loadData() {
        await this.fetchMoreLogs()

        this.loading = false

        if (this.logs.length < this.limit) {
          this.more = false
        }
      },
      async fetchMoreLogs() {
        return await this.fetchLogs({
          project_id: this.project.id,
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
<style lang="scss" scoped>
  .page-header {
    padding: 20px;
    border-bottom: none;

    .logo {
      position: relative;
      float: left;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
      font-size: 40px;
      color: #20a0ff;
      border-radius: 3px;
      background-color: #fff;
      overflow: hidden;

      img {
        position: absolute;
        top: 50%;
        left: 50%;
        max-width: 100%;
        max-height: 100%;
        transform: translate(-50%, -50%);
      }
    }
    .meta {
      position: relative;
      line-height: 1.8em;
      padding-left: 50px;
      overflow: hidden;

      &:before {
        position: absolute;
        top: 20px;
        left: 20px;
        width: 1px;
        height: 60px;
        content: '';
        background-color: #e5e5e5;
      }
    }
    .name {
      color: #333;

      .el-tag {
        margin-left: 10px;
        vertical-align: 4px;
        font-weight: normal;
      }
    }
    .description {
      margin: 10px 0;
      padding-left: 10px;
      border-left: 5px solid #e5e5e5;
      font-size: 14px;
      font-weight: 400;
      color: #666;
    }
    .owner {
      font-size: 14px;
      color: #999;
      font-weight: 400;
      vertical-align: middle;
    }
    .links {
      overflow: hidden;

      .link {
        float: left;
        margin-right: 10px;
      }

      &, a {
        color: #999;
        font-size: 12px;
      }

      a:hover {
        color: #20a0ff;
      }
    }
  }
  .el-tabs {
    display: block;
  }
  .el-timeline {
    border-left: 1px solid #e5e5e5;
  }
  .el-timeline__item {
    position: relative;
    padding: 0 0 30px 30px;
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
  .project-members {
    padding: 10px;
    font-size: 14px;
    border: 1px solid #e5e5e5;
    border-radius: 3px;
    overflow: hidden;

    li:first-child {
      overflow: hidden;
      margin-bottom: 10px;

      h4 {
        font-weight: 400;
      }

      .fa {
        font-size: 16px;
      }
    }

    .member {
      float: left;
      margin-right: 5px;
    }
  }
</style>
<style lang="scss">
  .description a {
    color: #20a0ff;
  }
</style>
