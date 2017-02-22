<template>
  <el-row type="flex">
    <el-col :span="24">
      <project-form></project-form>
    </el-col>
  </el-row>
</template>
<script type="text/babel">
  import ProjectForm from './form.vue'

  export default {
    components: {
      ProjectForm
    }
  }
</script>

