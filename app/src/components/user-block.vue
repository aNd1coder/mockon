<template>
  <router-link :to="{ name: 'user', params: { username: user.username } }" class="el-user-block">
    <img :src="user.avatar | imgformat" class="el-user-avatar" :width="size"/>
    <span v-if="nameVisible" class="el-user-name">{{ user.nickname||user.username||user.email }}</span>
  </router-link>
</template>
<style lang="scss" scoped>
  .el-user-block {
    display: inline-block;
    text-align: center;
  }
  .el-user-avatar {
    border-radius: 3px;
  }
  .el-user-name {
    display: block;
    font-size: 12px;
    line-height: 1em;
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
      nameVisible: {
        type: Boolean,
        default: true
      }
    }
  }
</script>
