<template>
  <el-button :type="type" @click="actClick">
    <slot>button label</slot>
  </el-button>
</template>

<script lang="ts">
export default {
  name: "ErpButton",
  props: {
    type: {
      type: String
    }
  },
  methods: {
    actClick(e) {
      this.$emit('click', e)
    }
  }
}
</script>
