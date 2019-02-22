<template>
  <ul class="erp-droplist">
    <li class="erp-list" v-for="(item,index) in list" :key="index">
      <base-drop-list v-if="item.children" :list="item"></base-drop-list>
      <span v-else>{{item.title}}</span>
    </li>
  </ul>
</template>

<script>
  import BaseDropList from "../base/DropList";

  export default {
    name: "ErpDropList",
    components: {BaseDropList},
    props: ['list']
  }
</script>

<style lang='scss' scoped>
.erp-droplist {
  display: flex;
  justify-content: left;
  background: #fff;
  margin: 20px 0;
  .erp-list {
    padding: 20px;
  }
}
</style>
