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
      // pass
    },
    isReadonly() {
      if (!this.model)
        return true
      if (this.model.readonly)
        return true
      if (!this.model.editing)
        return true
      return false
    },
    suffixIcon() {
      if (this.model.readonly)
        return null
      if (this.model.editing)
        return 'el-icon-edit'
      return null
    }
  }
}
</script>
