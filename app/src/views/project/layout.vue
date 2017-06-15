<template>
  <el-row v-if="project && project.id" :class="collapse ? ' open': ''">
    <div class="col-sidebar">
      <div v-for="(menu, index) in menus">
        <router-link :to="{ name: menu.name, params: { code: project.code } }" :title="menu.title">
          <i :class="'fa fa-'+ menu.icon"></i>
          <span class="title">{{ menu.title }}</span>
        </router-link>
      </div>
      <i class="fa icon-collapse" @click="collapse = !collapse" :title="collapse ? '展开':'折叠'"></i>
    </div>
    <div class="col-main">
      <transition>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </div>
  </el-row>
</template>
<script type="text/babel">
  import { mapGetters, mapActions } from 'vuex'

  export default{
    data() {
      return {
        menus: [
          {
            title: '项目面板',
            name: 'project-dashboard',
            icon: 'tachometer'
          },
          {
            title: '接口管理',
            name: 'project-module',
            icon: 'code-fork'
          },
          {
            title: '成员管理',
            name: 'project-member',
            icon: 'user-o'
          },
          /*{
           title:'主题风格',
           name: 'project-theme',
           icon: 'picture-o'
           },
           {
           title: '错误码',
           name: 'project-error',
           icon: 'times-circle-o'
           },*/
          {
            title: '项目设置',
            name: 'project-setting',
            icon: 'sliders'
          },
        ],
        collapse: false
      }
    },
    computed: mapGetters(['project']),
    beforeRouteEnter({ params: { code } }, from, next) {
      next(async(vm) => {
        await vm.fetchProject({ code })

        if (!vm.project.id) {
          next({ name: 'project' })
        }
      })
    },
    methods: mapActions(['fetchProject'])
  }
</script>
<style lang="scss" scoped>
  .col-sidebar {
    position: fixed;
    top: 61px;
    left: 0;
    height: 100%;
    padding-top: 15px;
    width: 220px;
    overflow: hidden;
    background-color: #fafafa;
    transition: transform 0.2s linear;

    &:after {
      position: absolute;
      top: 0;
      right: 0;
      width: 5px;
      height: 100%;
      border-right: 1px solid #d3dce6;
      background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.05));
      content: '';
      pointer-events: none;
      z-index: 5;
    }

    .icon-collapse {
      position: absolute;
      top: 50%;
      right: 0;
      width: 15px;
      height: 40px;
      line-height: 40px;
      border: 1px solid #d3dce6;
      border-right: none;
      margin-right: 0;
      text-align: center;
      transform: translateY(-50%);
      color: #d3dce6;
      background-color: #fff;
      box-shadow: -1px 0 5px rgba(0,0,0,.1);
      z-index: 6;

      &:before {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        content: "\f100";
        cursor: pointer;
      }
    }

    a {
      position: relative;
      display: block;
      height: 38px;
      padding: 10px 0 4px 20px;
      font-size: 14px;
      overflow: hidden;

      &:hover {
        color: #20a0ff;
        background-color: #eff5f9;
      }

      &.active {
        background-color: #20a0ff;

        &, .fa {
          color: #fff;
        }
      }

      .fa {
        width: 20px;
        margin-right: 10px;
        vertical-align: -2px;
        font-size: 20px;
        text-align: center;
        color: #20a0ff;
      }
    }
  }
  .col-main {
    margin-left: 220px;
  }
  .open {
    .col-sidebar {
      width: 40px;

      a {
        padding-left: 10px;
      }

      .title {
        display: none;
      }
      .icon-collapse:before {
        content: "\f101";
      }
    }
    .col-main {
      margin-left: 40px;
    }
  }
</style>
