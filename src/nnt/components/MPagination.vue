<template>
  <el-pagination
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-size="pageSize"
    layout="total, prev, pager, next, jumper"
    :total="nowTableDataLength">
  </el-pagination>
</template>

<script lang="ts">
  export default {
    name: "MPagination",
    data() {
      return {
        currentPage: 1,
      }
    },
    props: {
      nowTableDataLength: {
        type: Number,
        require: true
      },
      pageSize: {
        type: Number,
        default: 10
      }
    },
    computed: {},
    methods: {
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.$emit('changeCurrentPage',val)
      },
    }
  }
</script>

<style lang='scss' scoped>

</style>
