<template>
  <el-row :gutter="20" v-loading.fullscreen.lock="loading" element-loading-text="加载中">
    <el-col class="el-col-search" :span="24">
      <el-input v-model="keyword" placeholder="请输入关键词..." icon="search"></el-select>
      </el-input>
    </el-col>
    <el-col v-for="project in projects" v-if="filterProject(project)" :key="project.id" :span="6">
      <el-project-block :project="project"></el-project-block>
    </el-col>
    <el-nodata v-if="projects.length === 0">
      <router-link class="el-button el-button--primary" :to="{ name: 'project-new' }">创建项目</router-link>
    </el-nodata>
  </el-row>
</template>
<script type="text/babel">
  import { mapGetters, mapActions } from 'vuex'
  import ElProjectBlock from '../../components/project-block.vue'
  import ElNodata from '../../components/nodata.vue'

  export default{
    components: {
      ElProjectBlock,
      ElNodata
    },
    data(){
      return {
        loading: true,
        keyword: ''
      }
    },
    computed: mapGetters(['session', 'projects']),
    beforeRouteEnter(to, from, next) {
      next(async (vm) => {
        await vm.fetchProjects({ action: 'explore' })
        vm.loading = false
      })
    },
    methods: {
      ...mapActions(['fetchProjects']),
      filterProject(project) {
        let fields = ['name', 'code', 'description']
        let match = false

        for (let field of fields) {
          if (project[field].toLowerCase().indexOf(this.keyword.toLowerCase()) !== -1) {
            match = true
          }
        }

        return match
      },
    }
  }
</script>
<style lang="scss" scoped>
  .el-row {
    padding: 20px 10px;
    margin: 0 !important;
    overflow: hidden;
  }
  .el-col-search {
    margin-bottom: 10px;
  }
  .el-select {
    width: 130px;
  }
</style>
