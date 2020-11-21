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
      v-if="it().input || it().label"
      class="erp-filter-input"
      clearable
    >
    </el-input>

    <el-input-number
      type="input"
      :placeholder="placeholder"
      ref="input"
      v-model="model.tmp"
      :readonly="isReadonly()"
      :suffix-icon="suffixIcon()"
      v-if="it().number"
      class="erp-filter-input"
      clearable
      controls-position="right"
    >
    </el-input-number>

    <span
      v-if="it().datetime"
      class="erp-filter-input"
    >
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
      v-if="it().datetime_range"
      class="erp-filter-input"
    >
      <el-date-picker
        type="datetimerange"
        range-separator="至"
        start-placeholder="从"
        end-placeholder="止"
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
      v-if="it().date_range"
      class="erp-filter-input"
    >
      <el-date-picker
        type="daterange"
        range-separator="至"
        start-placeholder="从"
        end-placeholder="止"
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
      <erp-property-enumselect
        :value="model">
      </erp-property-enumselect>
    </span>

    <span
      v-if="it().rwcheck"
      class="erp-filter-input"
    >
      <erp-checkbox
        :value="model"
      >
      </erp-checkbox>
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

  .erp-filter-input {

    .el-range-editor {
      height: 30pt;

      .el-range-separator {
        line-height: 25pt;
      }

      .el-range-input {
        font-size: 1.2em;
      }
    }

    .el-input {
      width: 90px;
    }

    .el-input-group__prepend {
      background-color: #fff;
    }

    .el-input--mini .el-input__inner {
      height: 30pt;
      font-size: 1.2em;
    }
  }
}

.el-input {
  width: auto;
}
</style>
