<template>
  <span @click="handleRoute" :class="'el-user-block'+(user.avatar ? ' has-avatar':'')">
    <span class="el-user-avatar" :style="{ width: size + 'px',height: size + 'px','font-size': (fontSize || size) + 'px' }" :title="user | displayName">
      <img :src="user.avatar | imgformat" :width="size"/>
    </span>
    <span v-if="nameVisible" class="el-user-name">
      <slot name="name">{{ user | displayName }}</slot>
    </span>
  </span>
</template>
<style lang="scss" scoped>
  .el-user-block {
    display: inline-block;
    text-align: center;
    cursor: pointer;

    &:hover {
      &, .el-user-name {
        color: #20a0ff;
      }
    }

    &.has-avatar {
      .el-user-avatar:before {
        display: none;
      }
    }
  }
  .el-user-avatar {
    position: relative;
    display: block;
    margin: 0 auto;
    border-radius: 50%;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0 0 1px rgba(0, 0, 0, .3);

    &:before {
      position: absolute;
      top: 50%;
      left: 50%;
      font: normal normal normal 40px/1 FontAwesome;
      text-rendering: auto;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      content: '\f09b';
      color: #e6ebf1;
      transform: translate(-50%, -50%);
      font-size: inherit;
    }

    img {
      position: absolute;
      top: 50%;
      left: 50%;
      max-width: 100%;
      transform: translate(-50%, -50%);
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
      fontSize: {
        type: Number
      },
      disableRoute: {
        type: Boolean,
        default: false
      },
      nameVisible: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      handleRoute() {
        if (this.disableRoute) {
          return false
        } else {
          this.$router.push({ name: 'user', params: { username: this.user.username } })
        }
      }
    }
  }
</script>
