<template>
  <el-checkbox v-model="tmp"
               @change="actChanged">
  </el-checkbox>
</template>

<script lang="ts">
export default {
  name: "ReadonlyCheckbox",
  props: {
    value: {type: Boolean}
  },
  mounted() {
    this.tmp = this.value
  },
  data() {
    return {
      tmp: true
    }
  },
  methods: {
    actChanged() {
      this.tmp = this.value
    }
  }
}
</script>
