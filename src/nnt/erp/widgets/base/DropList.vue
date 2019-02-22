<template>
  <el-dropdown>
  <span class="el-dropdown-link">
    {{list.title}}<i class="el-icon-arrow-down el-icon--right"></i>
  </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="(item,index) in list.children" :key="index">{{item}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  export default {
    name: "BaseDropList",
    props: ['list']
  }
</script>

<style lang='scss' scoped>

</style>
