<template>
  <el-form :model="model" :rules="rules" ref="form">
    <slot>form items</slot>
  </el-form>
</template>

<script lang="ts">
export default {
  name: "Form",
  props: ['model', 'rules'],
  methods: {
    validate(cb: (pass: boolean) => void) {
      this.$refs.form.validate(cb)
    }
  }
}
</script>
