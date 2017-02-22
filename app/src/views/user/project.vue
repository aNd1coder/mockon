<template>
  <div>User account active</div>
</template>
<script type="text/babel">
  export default{
    beforeRouteEnter({ params: { token } }, from, next) {
      next(async(vm) => {
        console.log(token)
      })
    }
  }
</script>
