<template>
  <div class="m-table" @click.right.prevent="">
    <div class="title">{{title}}</div>
    <el-table
      :data="tableData"
      :border="true"
      :fit="true"
      ref="filterTable"
      style="width: 100%"
      @header-contextmenu="changeList"
    >
      <el-table-column v-for="(item,index) in tableTitle" :key="index"
                       :prop="item.type"
                       :label="item.title" :filters="getClassify(tableData,item.type)"
                       :filter-method="filterHandler"
                       v-if="!nowTab[index].hidden"
                       :fixed="item.fixed"
                       :width="tableData[0][item.type] | width"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{scope.row[item.type]}}</span>
        </template>
      </el-table-column>
      <slot></slot>
    </el-table>

  </div>
</template>

<script lang="ts">
  import ExportToExcel from "./ExportToExcel.vue";
  import MPagination from "./MPagination";

  export default {
    name: "MTable",
    components: {MPagination, ExportToExcel},
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
    data() {
      return {
        showTab: false,
        nowTab: this.tableTitle,
        opList: false,
        nowColumn: {}
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
          if (val.length - nowMatch.length > 8) {
            len = 16;
          }
        }
        return val.length * len - reduceLen;
      }
    },
    methods: {
      changeList(column, event) {
        this.nowColumn = column;
        this.opList = true;
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
    }
  }
</script>

<style lang='scss' scoped>
  .title {
    font: bold 26px/80px "Microsoft YaHei UI";
    height: 80px;
  }

  .op {
    padding-bottom: 20px;
  }

  .el-dropdown {
    line-height: 30px;
  }

  .el-table {
    background: none;
  }

  .m-table {
    width: 100%;
    height: 100%;
  }

  .navPage {
    position: fixed;
    left: 50%;
    bottom: 100px;
  }

</style>
