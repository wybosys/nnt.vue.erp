<template>
  <div class="">
    <erp-filter-input v-for="(each,index) in model" :model="each" :key="index"></erp-filter-input>
  </div>
</template>

<script lang="ts">
export default {
  name: "List",
  props: {
    model: {
      type: Array // IFilter
    }
  }
}
</script>
