<template>
  <el-row type="flex" class="project-new">
    <el-col :span="14" :offset="5">
      <project-form :edit-mode="false"></project-form>
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
