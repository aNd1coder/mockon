<template>
  <el-row v-if="project && project.id">
    <ul class="col-sidebar">
      <li v-for="(menu, index) in menus">
        <router-link :to="{ name: menu.name, params: { code: project.code } }">
          <i :class="'fa fa-'+ menu.icon"></i>
          {{ menu.title }}
        </router-link>
      </li>
    </ul>
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
           },*/
          {
            title: '错误码',
            name: 'project-error',
            icon: 'times-circle-o'
          },
          {
            title: '项目设置',
            name: 'project-setting',
            icon: 'sliders'
          },
        ],
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
</style>
