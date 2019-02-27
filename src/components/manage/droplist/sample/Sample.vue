<template>
  <div>
    <erp-picker-droplist :title="title" :items="items" @clickItem="clickItem"></erp-picker-droplist>
  </div>

</template>

<script lang="ts">

export default {
  name: "Sample",
  components: {},
  data() {
    return {
      title: "反馈 ",
      items: [
      ]
    }
  },
  methods: {
    clickItem(item) {
      console.log(`点击了第${item.index}按钮${item.label}`)
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
