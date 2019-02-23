<template>
  <el-form-item :prop="prop">
    <slot>item</slot>
  </el-form-item>
</template>

<script lang="ts">
export default {
  name: "ErpFormItem",
  props: ['prop']
}
</script>
