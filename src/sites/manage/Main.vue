<template>
  <div class="flex-vertical-container main-wrap">
    <header class="flex-between-container main-header">
      <div class="title">
        后台管理系统
      </div>
      <div>
        <el-button type="primary" @click="actExit">安全退出</el-button>
      </div>
    </header>
    <main-content class="main-container"></main-content>
  </div>
</template>

<script lang="ts">

import MainContent from "./MainContainer.vue";
import {RestSession} from "../../nnt/core/RestSession";
import {SignalFailed} from "../../nnt/core/Signals";
import {Model} from "../../nnt/core/ApiModel";
import {Application} from "../../nnt/erp/Application";

export default {
  name: 'Main',
  components: {MainContent},
  data() {
    return {}
  },
  mounted() {
    // 显示基础错误信息
    RestSession.signals.connect(SignalFailed, s => {
      let data: Model = s.data
      let content = 'RestSession fail:\nAPI ' + data.action + ' 返回 ' + JSON.stringify(data.response)
      alert(content)
    }, null);
  },
  methods: {
    actExit() {
      Application.shared.goback()
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
