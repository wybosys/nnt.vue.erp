<template>
  <el-input
    type="input"
    :placeholder="placeholder"
    ref="input"
    v-model="model.tmp"
    @change="cbChanged"
    :readonly="isReadonly()"
  >
  </el-input>
</template>

<script lang="ts">
export default {
  name: "PropertyInput",
  props: {
    'type': {},
    'placeholder': {},
    'model': {default: {}}
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
    }
  }
}
</script>
