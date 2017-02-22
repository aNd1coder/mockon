<template>
  <el-row :gutter="20" v-loading.fullscreen.lock="loading" element-loading-text="加载中">
    <el-col :span="8" v-for="project in projects">
      <div class="project-plate">
        <div class="project-plate-header">
          <h3 class="name">
            <router-link :to="{ name: 'project-dashboard', params: { code: project.code } }">
              {{ project.name }}
            </router-link>
            <span class="owner">
              / by
              <router-link :to="{ name: 'user', params: { username: project.owner.username } }">
                {{ project.owner.username }}
              </router-link>
            </span>
            <el-tag v-if="project.status == 1" type="gray">已废弃</el-tag>
          </h3>
          <router-link class="logo" :to="{ name: 'project-dashboard', params: { code: project.code } }">
            <img width="60" v-if="project.image" :src="project.image | imgformat">
            <span v-else>{{ project.name.charAt(0) }}</span>
          </router-link>
        </div>
        <div class="project-plate-content" v-html="marked(project.description)"></div>
        <div class="project-plate-footer">
          <router-link class="item" :to="{ name: 'project-member', params: { code: project.code } }">
            <i class="fa fa-user-o"></i>成员({{ project.members.length }})
          </router-link>
          <span class="item"><i class="fa fa-heart-o"></i>收藏(0)</span>
        </div>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="project-plate">
        <router-link class="fa fa-plus" :to="{ name: 'project-new' }"></router-link>
      </div>
    </el-col>
  </el-row>
</template>
<script type="text/babel">
  import { mapGetters, mapActions } from 'vuex'
  import { marked } from '../../utils'

  export default{
    data(){
      return {
        loading: true,
        marked
      }
    },
    computed: mapGetters(['projects']),
    beforeRouteEnter(to, from, next) {
      next(async(vm) => {
        await vm.fetchProjects()
        vm.loading = false
      })
    },
    methods: mapActions(['fetchProjects'])
  }
</script>
<style lang="scss" scoped>
  .el-row {
    padding: 20px 10px;
    margin: 0 !important;
    overflow: hidden;
  }
</style>
<style lang="scss">
  .project-plate {
    position: relative;
    margin-bottom: 20px;
    border: 1px solid #e5e5e5;
    border-radius: 5px;
    transition: all 0.3s;

    &, a {
      font-size: 12px;
    }

    &:hover {
      border-color: #20a0ff;
      box-shadow: 0 0 10px rgba(0, 0, 0, .15);
    }

    a {
      color: #666;

      &:hover {
        color: #20a0ff;
      }
    }

    .fa-plus {
      display: block;
      height: 150px;
      line-height: 150px;
      margin: 0;
      text-align: center;
      font-size: 50px;
      color: #e5e5e5;

      &:hover {
        color: #20a0ff;
      }
    }
  }
  .project-plate-header,
  .project-plate-content,
  .project-plate-footer {
    padding: 15px 15px 15px 95px;
  }
  .project-plate-header {
    position: relative;
    border-bottom: 1px solid #e5e5e5;

    .name {
      margin: 0;
      color: #475669;

      a {
        font-size: 16px;
        font-weight: 700;
      }

      .owner {
        &, a {
          color: #999;
          font-weight: 400;
          font-size: 12px;
          font-weight: 400;
        }

        a:hover {
          color: #20a0ff;
        }
      }
    }

    .logo {
      position: absolute;
      left: 20px;
      top: 20px;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      background-color: #fff;
      border-radius: 5px;
      border: 1px solid #e5e5e5;
      font-size: 40px;
      color: #20a0ff;
    }

    .el-tag {
      position: absolute;
      right: 10px;
      height: 20px;
      line-height: 20px;
      margin-left: 10px;
    }
  }
  .project-plate-content {
    height: 55px;
    line-height: 1.4;
    margin-bottom: 10px;
    color: #999;
    font-size: 14px;
    overflow: hidden;

    a {
      color: #20a0ff;

      &:hover {
        text-decoration: underline;
      }
    }
  }
  .project-plate-footer {
    padding-top: 0;
    color: #666;
    font-size: 0;

    .item {
      position: relative;
      display: inline-block;
      margin-right: 10px;
      font-size: 12px;
      vertical-align: middle;
    }
  }
</style>
