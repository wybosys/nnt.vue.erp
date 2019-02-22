<template>
  <base-collapse :listData="listData">
    <ul v-for="(item,index) in listData" :key="index" :slot="item.title">
      <li v-for="(subItem,index) in item.children" :key="index">{{subItem}}</li>
    </ul>
  </base-collapse>
</template>

<script lang="ts">
  import BaseCollapse from "../base/Collapse.vue";
  export default {
    name: "ErpCollapse",
    props: ['listData'],
    components: {BaseCollapse}
  }
</script>

<style lang='scss' scoped>

</style>
