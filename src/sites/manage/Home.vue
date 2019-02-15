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
    <main-content class="main-container"></main-content>
  </div>

</template>

<script lang="ts">
  import MainContent from "./MainContent";

  export default {
    name: 'HelloWorld',
    components: {MainContent},
    data() {
      return {
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .main-wrap {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  .main-header {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 80px;
    background-color: $color-base;
    color: #fff;
    text-align: center;
    padding: 0 60px;
    .title {
      font: 40px/80px 'Microsoft YaHei UI';
    }
  }

  .main-container {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 80px;
    background-color: #E9EEF3;
    color: #333;
    text-align: center;


  }


</style>
