<template>
  <m-table :tableTitle="tableTitle" :tableData="tableData"></m-table>
</template>

<script>
  import MTable from "./MTable";

  export default {
    name: "TableUseSample",
    components: {MTable},
    data() {
      return {
        tableTitle: [{
          title: '日期',
          type: 'date',
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
        }],
        tableData: [
          {
            date: '2016-05-03',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333,
            tag: '家'
          }, {
            date: '2016-05-02',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333,
            tag: '公司'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }, {
            date: '2016-05-01',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }, {
            date: '2016-05-08',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          },
        ]
      }
    }
  }
</script>

<style lang='scss' scoped>

</style>
