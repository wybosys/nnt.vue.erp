<template>
  <el-button @click="download">导出数据到Excel</el-button>
</template>

<script lang="ts">
import {config} from "../../../core/Config";

export default {
  name: "ErpExportToExcel",
  props: {
    title: {
      type: String,
      default: "表单数据"
    },
    tableTitle: {
      type: Array,
      require: true
    },
    tableData: {
      type: Array,
      require: true
    }
  },
  methods: {
    download() {
      import(config.THIRDLIBS + '/Export2Excel').then(excel => {
        let tHeaeder = [];
        let filterVal = [];
        this.tableTitle.forEach(v => {
          tHeaeder.push(v.title);
          filterVal.push(v.type);
        });
        let data = this.formatJson(filterVal, this.tableData);
        excel.export_json_to_excel({
          header: tHeaeder,
          data,
          filename: this.title,
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j];
      }))
    },
  }
}
</script>

<style lang='scss' scoped>

</style>
