<template>
  <el-menu
    class="erp-nav"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :default-active="currentNode ? currentNode.id + '' : ''"
  >
    <el-submenu
      v-for="item in naviTree"
      :key="item.id"
      :index="item.id + ''"
    >
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span
          class="erp-menu-0"
        >
          {{ item.label }}
        </span>
      </template>

      <el-menu-item
        class="erp-menu-1"
        v-for="sub in item.children"
        :key="sub.id"
        :index="sub.id + ''"
        @click="changeCurrentNode(sub)"
      >
        {{ sub.label }}
      </el-menu-item>

    </el-submenu>
  </el-menu>
</template>

<script lang="ts">

import {TreeNode} from "../../ModuleTree";

export default {
  name: "NavigationList",
  props: ['currentNode', 'naviTree'],
  methods: {
    changeCurrentNode(currentNode: TreeNode) {
      this.$emit("changeActiveTab", currentNode)
    }
  }
}
</script>

<style lang='scss' scoped>
.erp-nav {
  text-align: left;

  .erp-menu-0 {
    font-size: 1.1em;
  }

  .erp-menu-1 {
    text-indent: 2em;
    font-size: 1.1em;
  }
}
</style>
