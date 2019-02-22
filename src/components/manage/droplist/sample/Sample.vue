<template>
  <div>
    <erp-drop-list :list="list"></erp-drop-list>
    <erp-collapse :listData="list"></erp-collapse>
  </div>



</template>

<script lang="ts">

  import ErpCollapse from "../../../../nnt/erp/widgets/collapse/Collapse";
  import ErpDropList from "../../../../nnt/erp/widgets/droplist/DropList";
  export default {
    name: "Sample",
    components: {ErpDropList, ErpCollapse},
    data() {
      return {
        list: [
          {
            title: "一致性",
            children: [
              "与现实生活一致",
              "在界面中一致"
            ]
          },
          {
            title: "反馈 ",
            children: [
              "控制反馈",
              "页面反馈"
            ]
          },
          {
            title: "反馈 "
          },
        ]
      }
    }
  }
</script>

<style lang='scss' scoped>

</style>
