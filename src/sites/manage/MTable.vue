<template>
  <div>
    <div class="title">{{title}}</div>
    <el-button @click="download">导出数据到Excel</el-button>
    <el-table
      :data="tableData"
      :border="true"
      ref="filterTable"
      style="width: 100%">
      <el-table-column v-for="(item,index) in tableTitle" :key="index"
                       :prop="item.type"
                       :label="item.title" fixed :filters="getClassify(tableData,item.type)"
                       :filter-method="filterHandler"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{scope.row[item.type]}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
  export default {
    name: "MTable",
    props: {
      title: {
        type: String,
        default: "表格数据"
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
    data() {
      return {
        value6: '',
      }
    },
    methods: {
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      clearFilter() {
        this.$refs.filterTable.clearFilter();
      },
      getClassify(allData, type) {
        let classify = new Set();
        for (let data of allData) {
          if (data[type]) {
            classify.add(data[type])
          }
        }
        let nowClassify = Array.from(classify);
        nowClassify = nowClassify.map(e => {
          return {
            text: e,
            value: e
          }
        });
        return nowClassify;
      },
      download(){
        import('../../vendor/Export2Excel').then(excel => {
          let tHeaeder = [];
          let filterVal = [];
          this.tableTitle.forEach(v=>{
            tHeaeder.push(v.title);
            filterVal.push(v.type)
          });
          let list = this.tableData;
          let data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            header: tHeaeder,
            data,
            filename: this.title,
          })
        })
      },
      formatJson(filterVal,jsonData){
        return jsonData.map(v => filterVal.map(j=>{
          return v[j];
        }))
      },

    }
  }
</script>

<style lang='scss' scoped>
  .title {
    font-size: 30px;
    line-height: 100px;
    height: 100px;
  }
</style>
