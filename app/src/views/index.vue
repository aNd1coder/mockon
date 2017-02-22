<template>
  <div class="wrapper">
    <div class="page-header">
      <h1><img src="/static/img/logo.png" height="60"/></h1>
      <h2>在线文档管理调试平台</h2>
    </div>
    <ul class="features">
      <li>- 倡导文档驱动开发模式，设计 > 测试 > 开发</li>
      <li>- 兼容 <a href="http://swagger.io/" target="_blank">Swagger</a>／<a href="http://raml.org/" target="_blank">RAML</a> 规范设计接口</li>
      <li>- 接口数据模拟，真正达到前后端并行开发</li>
      <li>- 接口请求代理，彻底从跨域问题中解脱出来</li>
      <li>- 便捷的数据导入导出，支持全新项目或者老项目快速</li>
      <li>- 界面友好、操作高效，通过点击和拖拽就可以完成大部分操作</li>
      <li>- 基于项目，多成员协作，多版本管理，清晰的操作日志</li>
      <li>- 平台数据请求接口基于 <a href="https://jwt.io/" target="_blank">JWT</a> 校验，保障数据安全</li>
    </ul>
  </div>
</template>
<script type="text/babel">
  export default{
  }
</script>
<style lang="scss" scoped>
  .wrapper {
    text-align: center;
  }
  .page-header {
    padding: 10rem 6rem;
    background-color: #f6f6f6;

    h2 {
      margin-top: 1rem;
      font-size: 18px;
      color: #999;
    }
  }

  .features {
    margin: 50px auto;
    width: 450px;
    line-height: 2rem;
    text-align: left;

    a {
      color: #20a0ff;
    }
  }
</style>
