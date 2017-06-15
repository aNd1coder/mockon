<template>
  <router-link :to="{ name: 'user', params: { username: user.username } }" class="el-user-block">
    <span class="el-user-avatar"><img :src="user.avatar | imgformat" :width="size" :title="user | displayName"/></span>
    <span v-if="nameVisible" class="el-user-name">{{ user | displayName }}</span>
  </router-link>
</template>
<style lang="scss" scoped>
  .el-user-block {
    display: inline-block;
    text-align: center;
  }
  .el-user-avatar {
    position: relative;
    display: block;
    width: 40px;
    height: 40px;
    margin: 0 auto;

    &:before {
      position: absolute;
      top: 50%;
      left: 50%;
      font: normal normal normal 40px/1 FontAwesome;
      text-rendering: auto;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      content: '\f09b';
      color: #e5e5e5;
      transform: translate(-50%, -50%);
    }

    img {
      position: absolute;
      top: 50%;
      left: 50%;
      max-width: 100%;
      max-height: 100%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
    }
  }
  .el-user-name {
    display: block;
    font-size: 12px;
    line-height: 1em;
    margin-top: 5px;
  }
</style>
<script type="text/babel">
  export default{
    name: 'el-user-block',
    props: {
      user: Object,
      size: {
        type: Number,
        default: 40,
        validator: function (value) {
          return value > 0
        }
      },
      disableRoute: {
        type: Boolean,
        default: false
      },
      nameVisible: {
        type: Boolean,
        default: true
      }
    }
  }
</script>
