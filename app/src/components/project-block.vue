<template>
  <div class="project-plate">
    <div class="project-plate-header">
      <h3 class="name">
        <router-link :to="{ name: 'project-dashboard', params: { code: project.code } }">
          {{ project.name }}
        </router-link>
        <el-tag v-if="project.private == 1" type="gray" title="私有项目"><i class="fa fa-lock"></i></el-tag>
      </h3>
      <router-link class="logo" :to="{ name: 'project-dashboard', params: { code: project.code } }">
        <img width="60" v-if="project.image" :src="project.image | imgformat">
        <span v-else>{{ project.name.charAt(0) }}</span>
      </router-link>
    </div>
    <div class="project-plate-content" v-html="marked(project.description)"></div>
    <div class="project-plate-footer">
      <el-user-block v-for="member in project.members" :key="member.id" :size="20" :user="member" :nameVisible="false"></el-user-block>
      <router-link :to="{ name: 'project-member', params: { code: project.code } }">
        <i class="fa fa-dobule-arrow-right"></i>
      </router-link>
    </div>
  </div>
</template>
<script type="text/babel">
  import { marked } from '../utils'
  import ElUserBlock from '../components/user-block.vue'

  export default{
    name: 'el-project-block',
    props: {
      project: Object
    },
    components:{
        ElUserBlock
    },
    data(){
      return {
        marked
      }
    },
  }
</script>
