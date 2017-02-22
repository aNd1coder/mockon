<template>
  <div v-else class="el-nodata">
    <i class="fa fa-github"></i>
    <span class="el-nodata-message">{{ message }}</span>
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
    padding: 50px;
    text-align: center;
    color: #eee;

    .fa {
      display: block;
      font-size: 100px;
    }
  }
  .el-nodata-message {
    color: #ddd;
  }
</style>
