<template>
  <div class="el-nodata">
    <i class="fa fa-github"></i>
    <div class="el-nodata-message">{{ message }}</div>
    <slot></slot>
  </div>
</template>
<script type="text/babel">
  export default{
    name: 'el-nodata',
    props: {
      message: {
        type: String,
        default: '喵~ 没有找到数据'
      }
    }
  }
</script>
<style lang="scss" scoped>
  .el-nodata {
    display: block;
    width: 100%;
    padding: 50px;
    text-align: center;
    color: #eee;

    .fa {
      display: block;
      font-size: 100px;
    }
  }
  .el-nodata-message {
    margin: 10px 0;
    color: #ddd;
  }
</style>
