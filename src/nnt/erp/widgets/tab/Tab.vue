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
    name: "Tab",
    props: {
      currentNode: {
        type: TreeNode,
        require: true
      }
    },
    data() {
      return {
        tabs: []
      }
    },
    watch: {
      currentNode(val) {
        if (val) {
          this.toPage(val)
        }
      }
    },
    methods: {
      changeTab(e) {
        this.$emit('changeActiveTab', this.tabs[e.index]);
      },
      removeTab(idx) {
        if (this.tabs.length > 1) {
          ArrayT.RemoveObjectByFilter(this.tabs, (tab: TreeNode) => {
            return tab.id == idx;
          });
          let len = this.tabs.length;
          this.$emit('changeActiveTab', this.tabs[len - 1]);
        } else {
          this.tabs = [];
          this.$emit('changeActiveTab', null);
        }

      },
      toPage(currentNode: TreeNode) {
        if (!this.tabs.length || this.uniq(currentNode) === undefined) {
          this.tabs.push(currentNode);
        }
      },
      uniq(currentNode: TreeNode) {
        return ArrayT.QueryIndex(this.tabs, (tab: TreeNode) => {
          return tab.id == currentNode.id;
        });
      },

    }
  }
</script>

<style lang='scss' scoped>
  .el-tabs /deep/ {
    .el-tabs__item {
      transition: .5s;
    }
    .el-tabs__item.is-active {
      border-bottom-color: $color-base;
      background: $color-base;
      color: #fff;
    }
    .el-tabs__header {
      border-bottom-color: $color-base;
    }
  }
</style>
