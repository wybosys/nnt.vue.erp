<template>
  <div>
    <m-table :tableTitle="tableTitle" :tableData="nowTableData"></m-table>
    <div class="navPage flex-around-container">
      <m-pagination :pageSize="pageSize" :nowTableDataLength="tableData.length"
                    @changeCurrentPage="changeCurrentPage"></m-pagination>
      <m-change-table-column :tableTitle="tableTitle"></m-change-table-column>
      <export-to-excel :tableData="tableData" :tableTitle="tableTitle" title="表单数据"></export-to-excel>
    </div>
  </div>

</template>

<script lang="ts">
  import MTable from "../../nnt/components/MTable";
  import MPagination from "../../nnt/components/MPagination";
  import ExportToExcel from "../../nnt/components/ExportToExcel";
  import MChangeTableColumn from "../../nnt/components/MChangeTableColumn";

  export default {
    name: "TableUseSample",
    components: {MChangeTableColumn, ExportToExcel, MPagination, MTable},
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
