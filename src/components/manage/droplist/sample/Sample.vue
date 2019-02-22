<template>
  <div>
    <erp-drop-list :title="title" :items="items" @clickItem="clickItem"></erp-drop-list>
  </div>

</template>

<script lang="ts">

  import ErpDropList from "../../../../nnt/erp/widgets/base/DropList";
  import {IListItem, ListItem} from "../../../../nnt/model/List";

  export default {
    name: "Sample",
    components: {ErpDropList},
    data() {
      return {
          title: "反馈 ",
          items: [
            ListItem.Text("控制反馈"),
            ListItem.Text("页面反馈")
          ]
      }
    },
    methods:{
      clickItem(item:IListItem){
        console.log(`点击了第${item.index}按钮${item.label}`)
      }
    }
  }
</script>

<style lang='scss' scoped>

</style>
