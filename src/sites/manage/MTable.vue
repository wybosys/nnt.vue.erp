<template>
  <div class="m-table">
    <div class="title">{{title}}</div>
    <el-dropdown trigger="click" @command="changeTabInfo">
      <el-button type="primary">
        隐藏列表<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(item,index) in nowTab" :key="index" :command="index">
          <i class="el-icon-check" v-if="item.hidden"></i> {{item.title}}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-button @click="download">导出数据到Excel</el-button>
    <el-table
      :data="nowTableData"
      :border="true"
      :fit="true"
      ref="filterTable"
      style="width: 100%">
      <el-table-column v-for="(item,index) in tableTitle" :key="index"
                       :prop="item.type"
                       :label="item.title" :filters="getClassify(tableData,item.type)"
                       :filter-method="filterHandler"
                       v-if="!nowTab[index].hidden"
                       :fixed="item.fixed"
                       :width="nowTableData[0][item.type] | width"
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
        showTab: false,
        nowTab: this.tableTitle,
        nowTableData: this.tableData
      }
    },
    filters: {
      width(val) {
        val = val + '';
        let len = 24;
        let reduceLen = 0;
        let nowMatch = val.match(/[A-Za-z0-9\-]/ig);
        if (nowMatch) {
          reduceLen = 10 * nowMatch.length;
        }
        if (val.length < 4) {
          len = 32;
        } else if (nowMatch) {
          reduceLen = 10 * nowMatch.length;
          if (val.length - nowMatch.length > 8){
            len = 16;
          }
        }
        return val.length * len - reduceLen;
      }
    },
    methods: {
      changeTabInfo(idx) {
        this.nowTab[idx].hidden = !this.nowTab[idx].hidden;
        this.$set(this.nowTab, idx, this.nowTab[idx]);
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
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
      download() {
        import('../../vendor/Export2Excel').then(excel => {
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
  .title {
    font-size: 30px;
    line-height: 100px;
    height: 100px;
  }

  .el-dropdown {
    line-height: 30px;
  }
  .el-table {
    background: none;
  }
  .m-table {
    width: 100%;
  }


</style>
