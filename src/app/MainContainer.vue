<template>
  <div>
    <aside class="main-aside">
      <erp-navigation-list :currentNode="currentNode" :naviTree="naviTree" @changeActiveTab="changeCurrentNode"></erp-navigation-list>
    </aside>
    <main class="main" @click.right.prevent="">
      <erp-tab class="main-tab" :currentNode="currentNode" @changeActiveTab="changeCurrentNode"></erp-tab>
      <div class="main-content">
        <keep-alive>
          <component :is="currentNode ? currentNode.route.component: ''"></component>
        </keep-alive>
      </div>
    </main>
  </div>
</template>

<script lang="ts">

import {Application} from "../nnt/erp/Application";
import {TreeNode} from "../nnt/erp/ModuleTree";

export default {
  name: "MainContainer",
  components: {},
  data() {
    return {
      naviTree: null,
      currentNode: null
    }
  },
  created() {
    this.naviTree = Application.shared.tree.children
  },
  methods: {
    changeCurrentNode(currentNode: TreeNode) {
      this.currentNode = currentNode;
    }
  }
}
</script>

<style lang='scss' scoped>
  .main-aside {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background-color: $aside-color;
    color: #fff;
    text-align: center;
    line-height: 200px;
    width: 300px;
    height: 100%;
    oevrflow-y: auto;
  }

  .main {
    position: absolute;
    left: 300px;
    right: 0;
    top: 0;
    bottom: 0;
    box-sizing: border-box;

    .main-tab {
      background: #fff;
    }

    .main-content {
      padding: 0 15px;
      position: absolute;
      left: 0;
      top: 80px;
      bottom: 0;
      right: 0;
      overflow-y: auto;
    }
  }
</style>
