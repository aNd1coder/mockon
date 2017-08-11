<template>
  <el-row :gutter="20" v-loading.fullscreen.lock="loading">
    <el-col class="el-col-search" :span="24">
      <el-tooltip content="可粘贴 Mock 地址快速跳转到编辑页" placement="top">
        <el-input v-model="keyword" placeholder="请输入..." icon="search" @input="handleSearch"></el-input>
      </el-tooltip>
    </el-col>
    <el-col v-for="project in filteredProject" :key="project.id" :span="6">
      <el-project-block :project="project"></el-project-block>
    </el-col>
    <el-nodata v-if="filteredProject.length === 0">
      <router-link class="el-button el-button--primary" :to="{ name: 'project-new' }">创建项目</router-link>
    </el-nodata>
  </el-row>
</template>
<script type="text/babel">
  import { mapGetters, mapActions } from 'vuex'
  import { MOCK_URL } from '../../config'
  import { base64Encode, base64Decode } from '../../utils'
  import ElProjectBlock from '../../components/project-block.vue'
  import ElNodata from '../../components/nodata.vue'

  export default{
    components: {
      ElProjectBlock,
      ElNodata
    },
    data() {
      return {
        loading: true,
        keyword: ''
      }
    },
    computed: {
      ...mapGetters([
        'projects',
        'project',
        'response'
      ]),
      filteredProject() {
        return this.projects.filter(project => {
          let fields = ['name', 'code', 'description']
          let match = false

          for (let field of fields) {
            if (project[field].toLowerCase().indexOf(this.keyword.toLowerCase()) !== -1) {
              match = true
            }
          }

          return match
        })
      }
    },
    beforeRouteEnter(to, from, next) {
      next(async (vm) => {
        await vm.fetchProjects({ action: 'explore' })
        vm.loading = false
      })
    },
    methods: {
      ...mapActions([
        'fetchProjects',
        'fetchProject',
        'fetchResponse'
      ]),
      async handleSearch() {
        if (this.keyword.indexOf(MOCK_URL) === 0) {
          let id = base64Decode(this.keyword.replace(MOCK_URL, ''))
          this.loading = true

          await this.fetchResponse({ id })
          await this.fetchProject({ id: this.response.project_id })
          this.loading = false
          this.$router.push({
            name: 'project-api-edit',
            params: {
              code: this.project.code,
              id: base64Encode(this.response.api_id),
              response_id: id
            }
          })
          this.keyword = ''
        }
      }
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
</style>
