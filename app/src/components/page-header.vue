<template>
  <div class="page-header">
    <h1 class="pull-left">{{ title }}</h1>
    <slot name="button"></slot>
  </div>
</template>
<script type="text/babel">
  export default{
    name: 'el-page-header',
    props: {
      title: {
        type: String
      }
    }
  }
</script>
