<template>
  <el-table
    style="width: 100%"
    border
    fit
    stripe
    :data="model"
  >
    <el-table-column label="属性名" width="180" prop="label"></el-table-column>
    <el-table-column label="值" width="180" prop="value">
      <template slot-scope="input">
        <erp-input-property :model="input.row"></erp-input-property>
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

import {IProperty} from "../../../model/base/Property";

export default {
  name: "PropertyGrid",
  props: {
    model: {
      type: Array // IProperty[]
    }
  },
  methods: {
    actToggleEdit(scope) {
      let row: IProperty = scope.row
      if (!row.readonly) {
        row.editing = !row.editing
        if (!row.editing)
          row.tmp = row.value
      }
    },
    actSave(scope) {
      let row: IProperty = scope.row
      this.$emit('save', row)
    },
    btnEditLabel(scope) {
      let row: IProperty = scope.row
      if (row.readonly)
        return '只读'
      return row.editing ? '取消' : '修改'
    },
    btnSaveDisabled(scope) {
      let row: IProperty = scope.row
      return row.tmp == row.value
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
