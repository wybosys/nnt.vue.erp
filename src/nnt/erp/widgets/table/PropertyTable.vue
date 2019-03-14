<template>
  <div id="table">
    <el-table :style="{width:tableWidth}"
              border
              fit
              stripe
              :data="model.rows"
    >
      <el-table-column v-for="(col,index) in model.columns"
                       :fixed="index == 0"
                       :key="index"
                       :prop="col.variable"
                       :label="col.label"
                       :sortable="col.sort == 1 || col.sort == 2"
                       :min-width="col | columnWidth">
        <template slot-scope="input">
          <erp-input-property :model="input.row[index]"></erp-input-property>
        </template>
      </el-table-column>
      <el-table-column :width="editWidth(model)" fixed="right">
        <template slot="header" slot-scope="header">
          <el-button v-if="model.refreshable" size="mini" type="success" @click="actRefresh(header)">刷新</el-button>
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
  </div>
</template>

<script lang="ts">
import {Cell, ICell} from "../../../model/table/Cell";
import {ArrayT} from "../../../core/Kernel";
import {DefaultValue} from "../../../core/Variant";

const TABLE_CHAR_WIDTH = 14
const TABLE_SPACE = 22
const TABLE_SKIP_SCROll = 10
const BUTTON_WIDTH = 56
const BUTTON_MARGIN = 10

export default {
  name: "PropertyTable",
  props: {
    model: {
      type: Object // IPropertyTable
    },
  },
  data() {
    return {
      createdRows: [],
      editAreaWidth: 0,
    }
  },
  computed: {
    tableWidth() {
      let len = 0;
      this.model.columns.forEach(col => {
        len += col.label.length * col.multiple * TABLE_CHAR_WIDTH + TABLE_SPACE
      });
      len += TABLE_SKIP_SCROll + this.editAreaWidth
      let main = document.body.querySelector('#table');
      if (main && len < main.clientWidth)
        len = main.clientWidth
      return len + 'px'
    }
  },
  filters: {
    columnWidth(col) {
      return col.label.length * col.multiple * TABLE_CHAR_WIDTH + TABLE_SPACE
    }
  },
  methods: {
    editWidth() {
      let rowscnt = 0;
      if (this.model.editable)
        rowscnt += 2;
      if (this.model.removable)
        rowscnt++;
      let headscnt = 0;
      if (this.model.refreshable)
        headscnt += 1;
      if (this.model.creatable)
        headscnt += 1;
      let count = Math.max(rowscnt, headscnt);
      this.editAreaWidth = BUTTON_WIDTH * count + count * BUTTON_MARGIN - BUTTON_MARGIN + TABLE_SPACE + TABLE_SKIP_SCROll;
      return this.editAreaWidth;
    },
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
        let c = Cell.Value(DefaultValue(col.type)).strictAs(col)
        if (!c.readonly)
          c.editing = true
        nw.push(c)
      })
      this.model.rows.push(nw)
      this.createdRows.push(nw)
      // 保存后才真正调用增加的event
    },
    actRefresh(scope) {
      this.$emit('refresh')
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
