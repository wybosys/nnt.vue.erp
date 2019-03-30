<template>
  <span class="wrap">
    <span v-if="withlabel" style="padding: 0 1em">{{model.label}}</span>
    <el-input
      v-if="it().input || it().number"
      type="input"
      :placeholder="placeholder"
      ref="input"
      v-model="model.tmp"
      :readonly="isReadonly()"
      :suffix-icon="suffixIcon()">
    </el-input>

    <label v-else-if="it().label">
      {{model.tmp}}
    </label>

    <el-date-picker v-else-if="it().datetime"
                    placeholder="日期时间"
                    align="right"
                    :readonly="isReadonly()">
    </el-date-picker>

    <el-date-picker v-else-if="it().date"
                    placeholder="日期"
                    align="right"
                    :readonly="isReadonly()">
    </el-date-picker>

    <el-switch v-else-if="it().switch"
               :readonly="isReadonly()">
    </el-switch>

    <erp-checkbox-readonly v-else-if="it().rocheck"
                           :value="model.tmp">
    </erp-checkbox-readonly>

    <el-checkbox v-else-if="it().rwcheck"
                 :value="model.tmp">
    </el-checkbox>

    <erp-property-enumselect v-else-if="it().combo"
                             :value="model">
    </erp-property-enumselect>

  </span>
</template>

<script lang="ts">

import {Property} from "../../../model/base/Property";
import {InputType, InputUtil} from "./InputUtil";

export default {
  name: "PropertyInput",
  props: {
    'type': {},
    'placeholder': {},
    'model': {
      default: new Property()
    },
    'withlabel': {
      type: Boolean
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
