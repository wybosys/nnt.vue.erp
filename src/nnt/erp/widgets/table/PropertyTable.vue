<template>
  <el-table style="width: 100%"
            border
            fit
            stripe
            :data="model.rows"
  >
    <el-table-column v-for="(col,index) in model.columns"
                     :key="index"
                     :prop="col.variable"
                     :label="col.label"
                     :sortable="col.sort == 1 || col.sort == 2"
                     width="180">
      <template slot-scope="input">
        <erp-input-property :model="input.row[index]"></erp-input-property>
      </template>
    </el-table-column>
    <el-table-column width="180">
      <template slot-scope="control">
        <el-button size="mini" @click="actToggleEdit(control)">{{btnEditLabel(control)}}</el-button>
        <el-button size="mini" type="danger" @click="actSave(control)" :disabled="btnSaveDisabled(control)">保存
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import {ICell} from "../../../model/table/Cell";
import {ArrayT} from "../../../core/Kernel";

export default {
  name: "PropertyTable",
  props: {
    model: {
      type: Object // IPropertyTable
    }
  },
  methods: {
    actToggleEdit(scope) {
      let row: ICell[] = scope.row
      row.forEach(e => {
        if (!e.readonly) {
          e.editing = !e.editing
          if (!e.editing)
            e.tmp = e.value
        }
      })
    },
    actSave(scope) {
      let row: ICell[] = scope.row
      this.$emit('save', row)
    },
    btnEditLabel(scope) {
      let row: ICell[] = scope.row
      let rw = ArrayT.QueryObject(row, e => {
        return !e.readonly
      })
      // 没有找到一个可以修改的单元
      if (rw == null)
        return '只读'
      // 找正在修改的
      let ed = ArrayT.QueryObject(row, e => {
        return e.editing
      })
      return ed ? '取消' : '修改'
    },
    btnSaveDisabled(scope) {
      let row: ICell[] = scope.row
      // 如果没有不相等的，则代表没有改动，不能保存
      let edd = ArrayT.QueryObject(row, e => {
        return e.tmp != e.value
      })
      return edd == null
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
