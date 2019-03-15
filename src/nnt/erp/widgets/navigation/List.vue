<template>
  <el-menu
    class="nav"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :default-active="currentNode ? currentNode.id + '' : ''"
  >
    <el-submenu v-for="item in naviTree" :key="item.id" :index="item.id + ''">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span>{{item.label}}</span>
      </template>
      <el-menu-item class="subItem" v-for="subItem in item.children" :key="subItem.id" :index="subItem.id + ''"
                    @click="changeCurrentNode(subItem)">
        {{subItem.label}}
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
  .nav {
    text-align: left;

    .subItem {
      text-indent: 2em;
    }
  }
</style>
