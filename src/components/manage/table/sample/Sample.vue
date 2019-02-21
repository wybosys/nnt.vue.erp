<template>
  <div>
    <erp-table :tableTitle="tableTitle" :tableData="nowTableData"></erp-table>
    <div class="navPage flex-around-container">
      <erp-pagination :pageSize="pageSize" :nowTableDataLength="tableData.length"
                      @changeCurrentPage="changeCurrentPage"></erp-pagination>
      <erp-change-table-column :tableTitle="tableTitle"></erp-change-table-column>
      <erp-export-to-excel :tableData="tableData" :tableTitle="tableTitle" title="表单数据"></erp-export-to-excel>
    </div>
  </div>

</template>

<script lang="ts">

import ErpTable from "../../../../nnt/erp/widgets/table/Table.vue";
import ErpPagination from "../../../../nnt/erp/widgets/table/Pagination.vue";
import ErpChangeTableColumn from "../../../../nnt/erp/widgets/table/ChangeTableColumn.vue";
import ErpExportToExcel from "../../../../nnt/erp/widgets/export/ExportToExcel.vue";

export default {
  name: "TableUseSample",
  components: {ErpExportToExcel, ErpChangeTableColumn, ErpPagination, ErpTable},
  data() {
    return {
      tableTitle: [
        {
          title: '日期',
          type: 'date',
          fixed: true,
          hidden: false
        }, {
          title: '姓名',
          type: 'name',
        }, {
          title: '省份',
          type: 'province'
        }, {
          title: '市区',
          type: 'city'
        }, {
          title: '地址',
          type: 'address'
        }, {
          title: '邮编',
          type: 'zip'
        }, {
          title: '邮编2',
          type: 'zip1',
          hidden: true
        }],
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          zip1: '上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路',
        }, {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          zip1: '上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路',
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          zip1: '上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路',
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          zip1: '上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路',
        }, {
          date: '2016-05-08',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          zip1: '上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路',
        },
      ],
      pageSize: 3,
      startPage: 1,
    }
  },
  computed: {
    nowTableData() {
      return this.tableData.slice((this.startPage - 1) * this.pageSize, this.startPage * this.pageSize)
    }
  },
  methods: {
    changeCurrentPage(val) {
      this.startPage = val;
    },
  }
}
</script>

<style lang='scss' scoped>
  .navPage {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 8%;
    display: flex;
  }
</style>
