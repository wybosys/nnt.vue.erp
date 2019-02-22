<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item v-for="(item,index) in listData" :key="index" :title="item.title" :name="index + ''">
      <slot :name="item.title"></slot>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
  export default {
    name: "BaseCollapse",
    props:['listData'],
    data() {
      return {
        activeNames: ['0']
      };
    },
  }
</script>

<style lang='scss' scoped>

</style>

