<template>
  <div v-if="currentNode && tabs.length">
    <el-tabs v-model="currentNode.id+''" type="card" closable @tab-remove="removeTab" @tab-click="changeTab">
      <el-tab-pane
        v-for="item in tabs"
        :key="item.name"
        :label="item.label"
        :name="item.id+''"
      >
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import {TreeNode} from "../../ModuleTree";
import {ArrayT} from "../../../core/Kernel";

export default {
  name: "ErpTab",
  props: {
    currentNode:{
      type:TreeNode,
      require:true
    }
  },
  data() {
    return {
      tabs:[]
    }
  },
  watch: {
    currentNode(val){
      this.toPage(val)
    }
  },
  methods: {
    changeTab(e) {
      this.$emit('changeActiveTab', this.tabs[e.index]);
    },
    removeTab(idx) {
      if (this.tabs.length > 1) {
        ArrayT.RemoveObjectByFilter(this.tabs,(tab:TreeNode)=>{
          return tab.id == idx;
        });
        let len = this.tabs.length;
        this.$emit('changeActiveTab', this.tabs[len - 1]);
      } else {
        this.tabs = [];
        this.$emit('changeActiveTab', null);
      }

    },
    toPage(currentNode:TreeNode) {
      if (this.uniq(currentNode) === undefined) {
        this.tabs.push(currentNode);
      }
    },
    uniq(currentNode:TreeNode){
      if (this.tabs.length > 0) {
        return ArrayT.QueryIndex(this.tabs,(tab:TreeNode)=>{
          return tab.id == currentNode.id;
        });
      }  else {
        return undefined
      }

    },

  }
}
</script>

<style lang='scss' scoped>

</style>
