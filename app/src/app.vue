<template>
  <section>
    <header class="header">
      <div class="container">
        <div class="brand">
          <router-link to="/">
            <img class="logo" src="/static/img/logo.png" height="40">
          </router-link>
        </div>
        <el-menu v-if="signedIn" class="el-menu-right" mode="horizontal">
          <el-menu-item index="1">
            <router-link :to="{ name: 'notification' }">
              <i class="fa fa-bell-o"></i>消息
            </router-link>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">
              <el-user-block :user="session" :size="30" :nameVisible="false"></el-user-block>
            </template>
            <el-menu-item index="2-1">
              <router-link :to="{ name: 'project-new' }">新建项目</router-link>
            </el-menu-item>
            <el-menu-item index="2-2">
              <router-link :to="{ name: 'user', params: { username: session.username } }">我的主页</router-link>
            </el-menu-item>
            <el-menu-item index="2-3">
              <router-link :to="{ name: 'signout' }">退出</router-link>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <el-menu v-else class="el-menu-right" mode="horizontal">
          <el-menu-item index="1">
            <router-link :to="{ name: 'signin' }">
              <i class="fa fa-sign-in"></i>登录
            </router-link>
          </el-menu-item>
          <el-menu-item index="2">
            <router-link :to="{ name: 'signup' }">
              <i class="fa fa-user-plus"></i>注册
            </router-link>
          </el-menu-item>
        </el-menu>
      </div>
    </header>
    <div class="container">
      <transition>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </div>
  </section>
</template>
<script type="text/babel">
  import { mapGetters } from 'vuex'
  import ElUserBlock from './components/user-block.vue'

  export default {
    name: 'app',
    components: { ElUserBlock },
    computed: mapGetters(['signedIn', 'session'])
  }
</script>
<style lang="scss">
  * {
    padding: 0;
    margin: 0;
    list-style: none;
    box-sizing: border-box;
  }
  html, body {
    min-height: 100%;
    height: 100%;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
    overflow: auto;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
  }
  body {
    padding-top: 61px;
  }
  a {
    color: #475669;
    text-decoration: none;

    &:hover {
      color: #20a0ff;
    }
  }
  .fa {
    margin-right: 3px;
  }
  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    border-bottom: 1px solid #d3dce6;
    background-color: #eff2f7;
    z-index: 50;
    box-shadow: 0 1px 5px rgba(0, 0, 0, .1);

    &:after {
      visibility: hidden;
      display: block;
      font-size: 0;
      content: " ";
      clear: both;
      height: 0;
    }

    .brand {
      float: left;
      height: 60px;
      padding: 0 20px;
      color: #50e3c2;
      text-shadow: 0px 2px 3px #fff;
      font: normal 30px/60px Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
    }

    .logo {
      margin: 10px 10px 0 0;
      vertical-align: -10px;
    }

    .el-menu {
      float: left;
      background-color: transparent;

      .el-menu-item, .el-submenu__title {
        &, &:hover, &.is-active {
          border-bottom-width: 1px !important;
        }
      }

      .el-menu-item, .el-submenu {
        position: relative;
        bottom: -1px;
      }

      .el-menu-item {
        &:hover {
          background-color: transparent;
        }
        &.is-active {
          border-bottom-color: #20a0ff;
        }
      }

      .el-submenu .is-active {
        background-color: transparent;
        border-bottom-color: transparent;
      }
    }

    .el-menu-right {
      float: right;
      margin-right: 5px;
    }

    .el-menu-item {
      padding: 0;

      a {
        display: block;
        padding: 0 20px;
      }
    }

    .el-submenu {
      .is-active {
        border-bottom-color: transparent;
        background-color: #d3dce6;
      }
    }

    .el-badge__content.is-dot {
      top: 25px;
      right: 20px;
    }

    .el-user-block {
      width: 30px;
      height: 30px;
      margin-right: 5px;
      vertical-align: middle;
    }

    .el-user-avatar {
      width: 30px;
      height: 30px;

      &:before {
        font-size: 30px;
      }
    }

    .avatar {
      display: inline-block;

      border-radius: 3px;

    }

    .fa-user-circle-o {
      font-size: 30px;
    }
  }
  .container {
    margin: 0 auto;
  }
  .page-header {
    position: relative;
    padding: 20px 18px;
    background-color: #fafafa;
    border-bottom: 1px solid #d3dce6;
    overflow: hidden;

    .el-button {
      padding: 8px 12px;
    }
  }
  .el-form {
    padding: 30px 30px 10px;

    .el-button, .el-select {
      width: 100%;
    }

    .el-form-help {
      color: #999;
      font-size: 12px;

      a {
        color: #20a0ff;
      }
    }

    .el-dialog & {
      padding: 0;
    }
  }
  .el-form-block {
    margin: 50px 0;
    background-color: #eff2f7;
    border-radius: 5px;
    border-bottom: 1px solid #d4d4d4;
  }
  .el-form-item {
    &.is-required {
      .el-form-item__label:before {
        display: none;
      }
    }
  }
  .el-form-item__content {
    clear: both;
  }
  .el-tabs {
    width: 100%;
  }
  .el-tabs__active-bar {
    height: 1px;
  }
  .el-tabs__header {
    padding: 0 20px;
    margin-bottom: 0;
    background-color: #fafafa;
  }
  .el-tabs__item.is-active, .el-tab-pane {
    background-color: #fff;
  }
  .el-tabs__item {
    padding: 0 20px;
  }
  .el-tabs__content {
    overflow: visible;
  }
  .el-tab-pane {
    padding: 20px;
  }
  .el-table {
    border-width: 0 0 1px;

    td .cell {
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
  .el-dragger {
    width: 100%;
  }
  .el-upload {
    width: 100%;
  }
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

    .fa-plus-circle {
      display: block;
      height: 128px;
      line-height: 128px;
      margin: 0;
      text-align: center;
      font-size: 50px;
      color: #e5e5e5;

      &:hover {
        color: #20a0ff;
      }
    }
  }
  .project-plate-new {
    border-style: dashed;
  }
  .project-plate-header,
  .project-plate-content {
    padding: 15px 15px 15px 95px;
  }
  .project-plate-header {
    position: relative;
    border-bottom: 1px solid #e5e5e5;

    .name {
      margin: 0;
      height: 22px;
      color: #475669;
      font-weight: normal;

      a { font-size: 16px; }
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

      img {
        max-width: 100%;
      }
    }

    .el-tag {
      position: absolute;
      top: 50%;
      right: 10px;
      height: 20px;
      line-height: 20px;
      margin-left: 10px;
      transform: translateY(-50%);

      .fa { margin-right: 0; }
    }
  }
  .project-plate-content {
    height: 33px;
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
    margin: 15px 15px 15px 95px;
    color: #666;
    font-size: 0;
    overflow: hidden;
    white-space: nowrap;

    .el-user-avatar {
      width: 20px;
      height: 20px;
      margin-right: 3px;

      &:before {
        font-size: 20px;
      }

      img {
        border-radius: 50%;
      }
    }
  }
</style>
