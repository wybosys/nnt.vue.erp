<template>
  <div class="wrap">
    <span style="padding: 0 1em">{{model.label}}</span>
    <el-input
      type="input"
      :placeholder="placeholder"
      ref="input"
      v-model="model.tmp"
      @change="cbChanged"
      :readonly="isReadonly()"
      :suffix-icon="suffixIcon()"
    >
      <el-select placeholder="比较" v-model="model.operator" slot="prepend" class="input-with-select">
        <el-option label=">" value="gt"></el-option>
        <el-option label=">=" value="gte"></el-option>
        <el-option label="=" value="eq"></el-option>
        <el-option label="!=" value="not"></el-option>
        <el-option label="<" value="lt"></el-option>
        <el-option label="<=" value="lte"></el-option>
      </el-select>
    </el-input>
  </div>
</template>

<script lang="ts">

import {Filter} from "../../../model/filter/Filter";
import {InputUtil} from "../base/InputUtil";

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
    cbChanged() {
      InputUtil.PropertyChanged(this.model)
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
    display: flex;
    align-items: center;
    min-width: 100em;

    .el-select .el-input {
      width: 130px;
    }

    .el-input-group__prepend {
      background-color: #fff;
    }
  }

  .el-input {
    width: auto;
    flex: 1;
  }

</style>
