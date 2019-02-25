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
    <el-table-column width="300">
      <template slot="header" slot-scope="header">
        <el-button v-if="model.creatable" size="mini" type="warning" @click="actCreate(header)">增加</el-button>
      </template>
      <template slot-scope="control">
        <el-button v-if="model.editable" size="mini" @click="actToggleEdit(control)">{{btnEditLabel(control)}}
        </el-button>
        <el-button size="mini" type="success" @click="actSave(control)" :disabled="btnSaveDisabled(control)">保存
        </el-button>
        <el-button v-if="model.removable" size="mini" type="danger" @click="actRemove(control)">删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import {Cell, ICell} from "../../../model/table/Cell";
import {ArrayT} from "../../../core/Kernel";
import {Empty} from "../../../model/base/Empty";
import {DefaultValue} from "../../../core/Variant";

export default {
  name: "PropertyTable",
  props: {
    model: {
      type: Object // IPropertyTable
    }
  },
  data() {
    return {
      createdRows: []
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
      // 如果是新加的，则走新增的event
      let fnd = this.createdRows.indexOf(row)
      if (fnd != -1) {
        this.$emit('create', row, () => {
          // 添加成功
          ArrayT.RemoveObjectAtIndex(this.createdRows, fnd)

          // 同步数据
          row.forEach(e => {
            if (!e.readonly)
              e.value = e.tmp
          })
        })
      } else {
        this.$emit('save', row, () => {
          // 保存成功
          row.forEach(e => {
            if (!e.readonly)
              e.value = e.tmp
          })
        })
      }
    },
    actRemove(scope) {
      let row: ICell[] = scope.row
      // 如果是新加的，则不确认，直接删除
      let fnd = this.createdRows.indexOf(row)
      if (fnd != -1) {
        ArrayT.RemoveObjectAtIndex(this.createdRows, fnd)
        fnd = this.model.rows.indexOf(row)
        ArrayT.RemoveObjectAtIndex(this.model.rows, fnd)
      } else {
        let values = []
        this.model.columns.forEach((e, idx) => {
          values.push(e.label + ':' + row[idx].value)
        })
        if (confirm('确认删除 ' + values.join(', '))) {
          this.$emit('remove', row, () => {
            fnd = this.model.rows.indexOf(row)
            ArrayT.RemoveObjectAtIndex(this.model.rows, fnd)
          })
        }
      }
    },
    actCreate(scope) {
      // 添加一行新的
      let nw: ICell[] = []
      this.model.columns.forEach(col => {
        nw.push(Cell.Value(DefaultValue(col.type)).strictAs(col))
      })
      this.model.rows.push(nw)
      this.createdRows.push(nw)
      // 保存后才真正调用增加的event
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
