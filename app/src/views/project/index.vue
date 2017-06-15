<template>
  <el-row :gutter="20" v-loading.fullscreen.lock="loading" element-loading-text="加载中">
    <el-col :span="6" v-for="project in projects" :key="project.id">
      <el-project-block :project="project"></el-project-block>
    </el-col>
  </el-row>
</template>
<script type="text/babel">
  import { mapGetters, mapActions } from 'vuex'
  import ElProjectBlock from '../../components/project-block.vue'

  export default{
    components: {
      ElProjectBlock
    },
    data(){
      return {
        loading: true
      }
    },
    computed: mapGetters(['projects']),
    beforeRouteEnter(to, from, next) {
      next(async (vm) => {
        await vm.fetchProjects({ action: 'explore' })
        vm.loading = false
      })
    },
    methods: mapActions(['fetchProjects'])
  }
</script>
<style lang="scss" scoped>
  .el-row {
    padding: 20px 10px;
    margin: 0 !important;
    overflow: hidden;
  }
</style>
