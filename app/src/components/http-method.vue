<template>
  <el-tag :type="type">{{ method.replace('DELETE', 'DEL') }}</el-tag>
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
          'DELETE': 'danger',
          'PATCH': 'gray'
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
    padding: 0;
    margin-right: 5px;
    border: none;
    background-color: transparent;
    font-weight: 700;
  }
</style>
