<template>
  <el-tag :type="type">{{ method }}</el-tag>
</template>
<script type="text/babel">
  export default{
    name: 'el-http-method',
    props: {
      method: {
        type: String,
        default: 'GET'
      }
    },
    data(){
      return {
        methods: {
          'GET': 'primary',
          'POST': 'success',
          'PUT': 'warning',
          'DELETE': 'danger'
        }
      }
    },
    computed: {
      type() {
        return this.methods[this.method]
      }
    }
  }
</script>
<style lang="scss" scoped>
  .el-tag {
    font-weight: 700;
  }
</style>
