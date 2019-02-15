<template>
  <div>
    <m-table :tableTitle="tableTitle" :tableData="tableData"></m-table>
  </div>


</template>

<script lang="ts">
  import MTable from "../../nnt/components/MTable";

  export default {
    name: "TableUseSample",
    components: {MTable},
    data() {
      return {
        tableTitle: [{
          title: '日期',
          type: 'date',
          fixed:true,
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
          type: 'zip1'
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
        ]
      }
    }
  }
</script>

<style lang='scss' scoped>

</style>
