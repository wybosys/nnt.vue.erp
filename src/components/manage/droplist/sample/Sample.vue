<template>
  <div>
    <erp-picker-droplist :title="title" :items="items" @clickItem="clickItem"></erp-picker-droplist>
  </div>

</template>

<script lang="ts">

import {IListItem, ListItem} from "../../../../nnt/model/List";

export default {
  name: "Sample",
  components: {},
  data() {
    return {
      title: "反馈 ",
      items: [
        ListItem.Text("控制反馈"),
        ListItem.Text("页面反馈")
      ]
    }
  },
  methods: {
    clickItem(item: IListItem) {
      console.log(`点击了第${item.index}按钮${item.label}`)
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
