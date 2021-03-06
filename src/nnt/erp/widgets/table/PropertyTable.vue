<template>
  <div ref="table">
    <el-table
      :style="{width:tableWidth}"
      border
      fit
      stripe
      highlight-current-row
      :data="model.rows"
    >
      <el-table-column v-for="(col,index) in model.columns"
                       :fixed="index === 0"
                       :key="index"
                       :prop="col.variable"
                       :label="col.label"
                       :sortable="col.sort === 1 || col.sort === 2"
                       :min-width="col | columnWidth">
        <template slot-scope="input">
          <erp-input-property :model="input.row.cells[index]"></erp-input-property>
        </template>
      </el-table-column>

      <el-table-column :width="calcEditWidth(model)" fixed="right">
        <template slot="header" slot-scope="header">
          <el-button v-if="model.refreshable" size="mini" type="success" @click="actRefresh(header)">刷新</el-button>
          <el-button v-if="model.creatable" size="mini" type="warning" @click="actCreate(header)">增加</el-button>
        </template>
        <template slot-scope="control">
          <el-button v-if="model.editable" size="mini" @click="actToggleEdit(control)">{{ btnEditLabel(control) }}
          </el-button>
          <el-button v-if="model.editable" size="mini" type="success" @click="actSave(control)"
                     :disabled="btnSaveDisabled(control)">
            保存
          </el-button>
          <el-button v-if="model.removable" size="mini" type="danger" @click="actRemove(control)">删除
          </el-button>

          <!--自定义行处理按钮-->
          <el-button v-if="model.custom0" size="mini" @click="actCustom(0, control)">{{ model.custom0 }}</el-button>
          <el-button v-if="model.custom1" size="mini" @click="actCustom(1, control)">{{ model.custom1 }}</el-button>
          <el-button v-if="model.custom2" size="mini" @click="actCustom(2, control)">{{ model.custom2 }}</el-button>
          <el-button v-if="model.custom3" size="mini" @click="actCustom(3, control)">{{ model.custom3 }}</el-button>

        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script lang="ts">

import {Cell} from "../../../model/table/Cell";
import {DefaultValue} from "../../../core/Variant";
import {PropertyTable} from "../../../model/table/PropertyTable";
import {IColumn} from "../../../model/table/Column";
import {IRow, Row} from "../../../model/table/Row";
import {Property} from "../../../model/base/Property";
import {ArrayT} from "../../../core/ArrayT";

const TABLE_CHAR_WIDTH = 6
const TABLE_SPACE = 6
const TABLE_SKIP_SCROll = 10
const BUTTON_WIDTH = 56
const BUTTON_MARGIN = 10

export function CalcColumnWidth(col: IColumn) {
  let buf = Buffer.from(col.label)
  return buf.length * col.widthfactor * TABLE_CHAR_WIDTH + TABLE_SPACE
}

export default {
  name: "PropertyTable",
  props: {
    model: {
      default: new PropertyTable()
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
      this.model.columns.forEach((col: IColumn) => {
        len += CalcColumnWidth(col)
      })
      len += TABLE_SKIP_SCROll + this.editAreaWidth
      let main = this.$refs.table
      if (main && len < main.clientWidth)
        len = main.clientWidth
      return len + 'px'
    }
  },
  filters: {
    columnWidth(col: IColumn) {
      return CalcColumnWidth(col)
    }
  },
  methods: {
    calcEditWidth() {
      // 行交互按钮
      let rowscnt = 0;
      if (this.model.editable)
        rowscnt += 2;
      if (this.model.removable)
        rowscnt++;
      if (this.model.custom0)
        rowscnt++;
      if (this.model.custom1)
        rowscnt++;
      if (this.model.custom2)
        rowscnt++;
      if (this.model.custom3)
        rowscnt++;

      // 表格交互按钮
      let headscnt = 0;
      if (this.model.refreshable)
        headscnt += 1;
      if (this.model.creatable)
        headscnt += 1;

      // 总大小为表格和行增加的按钮的最大数（上下会重叠）
      let count = Math.max(rowscnt, headscnt);

      // 计算总大小
      this.editAreaWidth = BUTTON_WIDTH * count + count * BUTTON_MARGIN - BUTTON_MARGIN + TABLE_SPACE + TABLE_SKIP_SCROll;
      return this.editAreaWidth;
    },
    actToggleEdit(scope) {
      let row: IRow = scope.row
      row.cells.forEach(e => {
        if (!e.readonly) {
          e.editing = !e.editing
          if (!e.editing)
            e.tmp = Property._IMP_VariantToUIValue(e.value, e.type);
        }
      })
    },
    actSave(scope) {
      let row: IRow = scope.row
      // 如果是新加的，则走新增的event
      let fnd = this.createdRows.indexOf(row)
      if (fnd != -1) {
        this.$emit('create', row, () => {
          // 添加成功
          ArrayT.RemoveObjectAtIndex(this.createdRows, fnd)

          // 同步数据
          row.cells.forEach(e => {
            if (!e.readonly) {
              e.value = e.tmp
              e.editing = false
            }
          })
        })
      } else {
        this.$emit('save', row, () => {
          // 保存成功
          row.cells.forEach(e => {
            if (!e.readonly) {
              e.value = e.tmp
              e.editing = false
            }
          })
        })
      }
    },
    actRemove(scope) {
      let row: IRow = scope.row
      // 如果是新加的，则不确认，直接删除
      let fnd = this.createdRows.indexOf(row)
      if (fnd != -1) {
        ArrayT.RemoveObjectAtIndex(this.createdRows, fnd)
        fnd = this.model.rows.indexOf(row)
        ArrayT.RemoveObjectAtIndex(this.model.rows, fnd)
      } else {
        let values = []
        this.model.columns.forEach((e, idx) => {
          values.push(e.label + ':' + row.cellAt(idx).value)
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
      let nw: IRow = new Row();
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
      let row: IRow = scope.row
      let rw = ArrayT.QueryObject(row.cells, e => {
        return !e.readonly
      })
      // 没有找到一个可以修改的单元
      if (rw == null)
        return '只读'
      // 找正在修改的
      let ed = ArrayT.QueryObject(row.cells, e => {
        return e.editing
      })
      return ed ? '取消' : '修改'
    },
    btnSaveDisabled(scope) {
      let row: IRow = scope.row
      // 如果没有不相等的，则代表没有改动，不能保存
      let edd = ArrayT.QueryObject(row.cells, e => {
        // tmp需要从ui值转回标准值，再比较有没有修改
        return e.isModified();
      })
      return edd == null
    },
    actCustom(idx, scope) {
      let row: IRow = scope.row
      this.$emit('custom', row, idx)
    }
  }
}
</script>

