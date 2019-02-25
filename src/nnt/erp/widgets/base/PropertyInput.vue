<template>
  <el-input
    type="input"
    :placeholder="placeholder"
    ref="input"
    v-model="model.tmp"
    @change="cbChanged"
    :readonly="isReadonly()"
    :suffix-icon="suffixIcon()"
  >
  </el-input>
</template>

<script lang="ts">

import {Property} from "../../../model/base/Property";
import {InputUtil} from "./InputUtil";

export default {
  name: "PropertyInput",
  props: {
    'type': {},
    'placeholder': {},
    'model': {
      default: new Property()
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
