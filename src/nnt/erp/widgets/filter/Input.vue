<template>
  <span class="wrap">
    <span style="padding: 0 1em; font-size:1.3em">{{ model.label }}</span>

    <el-input
      type="input"
      :placeholder="placeholder"
      ref="input"
      v-model="model.tmp"
      :readonly="isReadonly()"
      :suffix-icon="suffixIcon()"
      v-if="it().input || it().number || it().label"
      class="erp-filter-input"
    >
      <el-select
        placeholder="比较"
        v-model="model.operator"
        slot="prepend"
        class="erp-filter-input-select"
      >
        <el-option label=">" value="gt"></el-option>
        <el-option label=">=" value="gte"></el-option>
        <el-option label="=" value="eq"></el-option>
        <el-option label="!=" value="not"></el-option>
        <el-option label="<" value="lt"></el-option>
        <el-option label="<=" value="lte"></el-option>
        <el-option label="🔍" value="search"></el-option>
      </el-select>
    </el-input>

    <span
      v-if="it().datetime"
      class="erp-filter-input"
    >
      <el-select
        placeholder="比较"
        v-model="model.operator"
        class="erp-filter-input-select"
      >
        <el-option label=">" value="gt"></el-option>
        <el-option label=">=" value="gte"></el-option>
        <el-option label="=" value="eq"></el-option>
        <el-option label="!=" value="not"></el-option>
        <el-option label="<" value="lt"></el-option>
        <el-option label="<=" value="lte"></el-option>
        <el-option label="🔍" value="search"></el-option>
      </el-select>

      <el-date-picker
        type="datetime"
        placeholder="日期时间"
        align="right"
        value-format="yyyy-MM-dd HH:mm:ss"
        size="mini"
        v-model="model.tmp"
      >
      </el-date-picker>
    </span>

    <span
      v-if="it().date"
      class="erp-filter-input"
    >
       <el-select
         placeholder="比较"
         v-model="model.operator"
         class="erp-filter-input-select"
       >
        <el-option label=">" value="gt"></el-option>
        <el-option label=">=" value="gte"></el-option>
        <el-option label="=" value="eq"></el-option>
        <el-option label="!=" value="not"></el-option>
        <el-option label="<" value="lt"></el-option>
        <el-option label="<=" value="lte"></el-option>
        <el-option label="🔍" value="search"></el-option>
      </el-select>

      <el-date-picker
        type="date"
        placeholder="日期"
        align="right"
        value-format="yyyy-MM-dd"
        size="mini"
        v-model="model.tmp"
      >
      </el-date-picker>
    </span>

    <span
      v-if="it().combo"
      class="erp-filter-input"
    >
      <el-select
        placeholder="比较"
        v-model="model.operator"
        class="erp-filter-input-select"
      >
        <el-option label=">" value="gt"></el-option>
        <el-option label=">=" value="gte"></el-option>
        <el-option label="=" value="eq"></el-option>
        <el-option label="!=" value="not"></el-option>
        <el-option label="<" value="lt"></el-option>
        <el-option label="<=" value="lte"></el-option>
        <el-option label="🔍" value="search"></el-option>
      </el-select>

      <erp-property-enumselect
        :value="model">
      </erp-property-enumselect>
    </span>

    <span
      v-if="it().rwcheck"
      class="erp-filter-input"
    >
      <el-select
        placeholder="比较"
        v-model="model.operator"
        class="erp-filter-input-select"
      >
        <el-option label=">" value="gt"></el-option>
        <el-option label=">=" value="gte"></el-option>
        <el-option label="=" value="eq"></el-option>
        <el-option label="!=" value="not"></el-option>
        <el-option label="<" value="lt"></el-option>
        <el-option label="<=" value="lte"></el-option>
        <el-option label="🔍" value="search"></el-option>
      </el-select>

      <el-checkbox
        :true-label="1"
        :false-label="0"
        v-model="model.tmp"
      >
      </el-checkbox>
    </span>

  </span>
</template>

<script lang="ts">
import {Filter} from "../../../model/filter/Filter";
import {InputType, InputUtil} from "../base/InputUtil";

export default {
  name: "Input",
  props: {
    type: {},
    placeholder: {},
    model: {
      default: new Filter(),
    },
  },
  computed: {
    value() {
      return this.model.tmp;
    },
  },
  methods: {
    it() {
      return InputType.Detect(this.model);
    },
    isReadonly() {
      return InputUtil.PropertyIsReadonly(this.model);
    },
    suffixIcon() {
      return InputUtil.PropertySuffixIcon(this.model);
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap /deep/ {
  margin: 20px;
  width: auto;
  display: flex;
  align-items: center;

  .erp-filter-input-select .el-input {
    width: 90px;
  }

  .erp-filter-input .el-input-group__prepend {
    background-color: #fff;
  }

  .erp-filter-input .el-input--mini .el-input__inner {
    height: 30pt;
    font-size: 1.2em;
  }
}

.el-input {
  width: auto;
}
</style>
