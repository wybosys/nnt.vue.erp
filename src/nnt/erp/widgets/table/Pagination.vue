<template>
  <el-pagination
    @current-change="cbPageChanged"
    layout="total, prev, pager, next, jumper"
    :current-page="currentPage()"
    :page-size="model.limit"
    :total="model.total"
  >
  </el-pagination>
</template>

<script lang="ts">
export default {
  name: "TablePagination",
  props: {
    model: {
      type: Object // INumPaged
    }
  },
  methods: {
    totalpages() {
      return Math.ceil(this.model.total / this.model.limit)
    },
    currentPage() {
      return this.model.page + 1
    },
    cbPageChanged(cur) {
      this.model.page = cur - 1
      this.$emit('pagechanged', cur)
    },
  }
}
</script>

<style lang='scss' scoped>

</style>
