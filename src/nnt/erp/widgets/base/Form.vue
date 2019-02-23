<template>
  <el-form :model="model" :rules="rules">
    <slot>form items</slot>
  </el-form>
</template>

<script lang="ts">
export default {
  name: "ErpForm",
  props: ['model', 'rules']
}
</script>
