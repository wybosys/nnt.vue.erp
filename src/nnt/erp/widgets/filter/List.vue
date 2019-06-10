<template>
  <div class="filter-list">
    <erp-filter-input v-for="(each,index) in model" :model="each" :key="index"></erp-filter-input>
  </div>
</template>

<script lang="ts">
import {Filters} from "../../../model/filter/Filter";

export default {
  name: "List",
  props: {
    model: {
      type: Array // IFilter
    }
  }
}
</script>

<style lang="scss" scoped>
  .filter-list {
    display: flex;
    flex-wrap: wrap;
  }

</style>
