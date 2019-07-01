<template>
  <el-pagination
    @current-change="cbPageChanged"
    @size-change="cbLimitChanged"
    layout="total, sizes, prev, pager, next, jumper"
    :current-page="currentPage()"
    :page-size="model.limit"
    :page-sizes="[10, 100, 500, 1000]"
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
      cbLimitChanged(cur) {
        this.model.limit = cur
        this.cbPageChanged(1)
      }
    }
  }
</script>

<style lang='scss' scoped>

</style>
