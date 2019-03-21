<template>
  <el-select v-mode="model"
             placeholder="placeholder">
    <el-option
      v-for="(p, i) in model"
      :key="i"
      :label="p.label"
      :value="p.value">
    </el-option>
  </el-select>
</template>

<script lang="ts">
export default {
  name: "Select",
  props: {
    model: {
      type: Object // IProperty[]
    },
    placeholder: {
      type: String
    }
  }
}
</script>
