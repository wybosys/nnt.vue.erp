<template>
  <el-menu
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :default-active="currentNode ? currentNode.id + '' : ''"
  >
    <el-submenu v-for="item in naviTree" :key="item.id" :index="item.id + ''">
      <template slot="title">
        <span>{{item.label}}</span>
      </template>
      <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="subItem.id + ''"
                    @click="changeCurrentNode(subItem)">
        {{subItem.label}}
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script lang="ts">
  import {Application} from "../../Application";
  import {TreeNode} from "../../ModuleTree";

  export default {
    name: "ErpDropList",
    props:['currentNode','naviTree'],
    methods: {
      changeCurrentNode(currentNode: TreeNode) {
        this.$emit("changeActiveTab",currentNode)
      }
    }
  }
</script>

<style lang='scss' scoped>

</style>
