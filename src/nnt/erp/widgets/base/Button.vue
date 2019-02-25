<template>
  <el-button class=""
             :type="type"
             @click="$emit('click', $event)"
  >
    <slot>button label</slot>
  </el-button>
</template>

<script lang="ts">
export default {
  name: "Button",
  props: {
    type: {
      type: String
    }
  }
}
</script>
