<template>
  <span class="wrap">
    <span style="padding: 0 1em">{{model.label}}</span>
    <el-input
      type="input"
      :placeholder="placeholder"
      ref="input"
      v-model="model.tmp"
      :readonly="isReadonly()"
      :suffix-icon="suffixIcon()"
    >

      <el-select placeholder="比较"
                 v-model="model.operator"
                 slot="prepend"
                 class="input-with-select"
      >
        <el-option label=">" value="gt"></el-option>
        <el-option label=">=" value="gte"></el-option>
        <el-option label="=" value="eq"></el-option>
        <el-option label="!=" value="not"></el-option>
        <el-option label="<" value="lt"></el-option>
        <el-option label="<=" value="lte"></el-option>
      </el-select>

      <el-date-picker v-if="it().datetime"
                      type="datetime"
                      placeholder="日期时间"
                      align="right"
                      slot="append"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :clearable="false"
                      :editable="false"
                      size="mini"
                      v-model="model.tmp"
      >
      </el-date-picker>

      <el-date-picker v-if="it().date"
                            type="date"
                            placeholder="日期"
                            align="right"
                            slot="append"
                            value-format="yyyy-MM-dd"
                            :clearable="false"
                            :editable="false"
                            size="mini"
                            v-model="model.tmp"
            >
      </el-date-picker>

    </el-input>
  </span>
</template>

<script lang="ts">

import {Filter} from "../../../model/filter/Filter";
import {InputType, InputUtil} from "../base/InputUtil";

export default {
  name: 'Input',
  props: {
    'type': {},
    'placeholder': {},
    'model': {
      default: new Filter()
    }
  },
  computed: {
    value: () => {
      return this.model.tmp
    }
  },
  methods: {
    it() {
      return InputType.Detect(this.model)
    },
    isReadonly() {
      return InputUtil.PropertyIsReadonly(this.model)
    },
    suffixIcon() {
      return InputUtil.PropertySuffixIcon(this.model)
    }
  }
}
</script>

<style lang="scss" scoped>
  .wrap /deep/ {
    margin: 20px;
    width: auto;
    display: flex;
    align-items: center;

    .el-select .el-input {
      width: 90px;
    }

    .el-input-group__prepend {
      background-color: #fff;
    }
  }

  .el-input {
    width: auto;
  }

</style>
