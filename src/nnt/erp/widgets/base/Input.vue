<template>
  <el-input :type="type" :placeholder="placeholder" ref="input" :value="value" @input="$emit('input', $event)"></el-input>
</template>

<script lang="ts">
export default {
  name: "Input",
  props: ['type', 'placeholder', 'value']
}
</script>
