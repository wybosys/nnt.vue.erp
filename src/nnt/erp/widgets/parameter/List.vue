<template>
  <div class="erp-parameter-list">
    <erp-parameter-input
      v-for="(each,index) in model"
      :model="each"
      :key="index">
    </erp-parameter-input>
  </div>
</template>

<script lang="ts">

import {IParameter} from "../../../model/parameter/Parameter";

export default {
  name: "List",
  props: {
    model: {
      type: Array,
      default: new Array<IParameter>()
    }
  }
}
</script>

<style lang="scss" scoped>
.erp-parameter-list {
  display: flex;
  flex-wrap: wrap;
}
</style>
