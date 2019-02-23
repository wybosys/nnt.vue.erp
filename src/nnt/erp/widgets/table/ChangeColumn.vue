<template>
  <div class="op">
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
  </div>
</template>

<script lang="ts">
export default {
  name: "ErpTableChangeColumn",
  props: {
    tableTitle: {
      type: Array,
      require: true
    },
  },
  data() {
    return {
      nowTab: this.tableTitle,
    }
  },
  methods: {
    changeTabInfo(idx) {
      this.nowTab[idx].hidden = !this.nowTab[idx].hidden;
      this.$set(this.nowTab, idx, this.nowTab[idx]);
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
