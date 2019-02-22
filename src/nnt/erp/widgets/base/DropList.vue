<template>
  <el-dropdown @command="handleCommand">
  <span class="el-dropdown-link">
    {{title}}<i class="el-icon-arrow-down el-icon--right"></i>
  </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="(item,index) in items" :key="index" :command="{item,index}">{{item.label}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script lang="ts">
  export default {
    name: "ErpDropList",
    props: ['title', 'items'],
    methods: {
      handleCommand(command) {
        command.item.index = command.index;
        this.$emit('clickItem', command.item);
      }
    }
  }
</script>

<style lang='scss' scoped>

</style>
