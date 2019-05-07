<template>
  <div>
    <erp-table :tableTitle="tableTitle" :tableData="nowTableData">
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </erp-table>
    <div class="navPage flex-around-container">
      <erp-table-pagination :pageSize="pageSize" :nowTableDataLength="tableData.length"
                      @changeCurrentPage="changeCurrentPage"></erp-table-pagination>
      <erp-table-changecolumn :tableTitle="tableTitle"></erp-table-changecolumn>
    </div>
    <erp-dialog v-if="scope" :scope="scope" text="编辑" @exitDialog="close" @saveDialog="saveDialog">
      <ul class="list">
        <li v-for="(item,index) in scope.row" :key="index">{{item}}</li>
      </ul>
    </erp-dialog>
  </div>

</template>

<script lang="ts">

export default {
  name: "TableUseSample",
  components: {},
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
      scope:null
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
    handleEdit(scope) {
      this.scope = scope;
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    close(){
      this.scope = null;
    },
    saveDialog(){
      this.scope = null;
    }
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
