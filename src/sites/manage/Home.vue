<template>
  <div class="flex-vertical-container main-wrap">
    <header class="flex-between-container main-header">
      <div class="title">
        后台管理系统
      </div>
      <div>
        <span>当前系统环境：{{}}</span>
        <span>
          <span>管理组|duchunhua</span>
        </span>
        <el-button type="primary">安全退出</el-button>
      </div>
    </header>
    <div class="flex main-container">
      <aside class="main-aside" width="200px">
        <c-aside></c-aside>
      </aside>
      <main class="main">
        <router-view></router-view>
      </main>
    </div>
  </div>

</template>

<script lang="ts">
  import CAside from "./CAside.vue";

  export default {
    name: 'HelloWorld',
    components: {CAside},
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .main-wrap {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
  .main-header {
    background-color: $color-base;
    color: #fff;
    text-align: center;
    padding: 0 60px;
    .title {
      font: 40px/80px 'Microsoft YaHei UI';
    }
  }


  .main-aside {
    background-color: $aside-color;
    color: #fff;
    text-align: center;
    line-height: 200px;
    width: 300px;
  }

  .main-container {
    flex: 1;
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  .main {
    flex: 1;
    padding: 0 50px;
  }


</style>
