<template>
  <div class="form-list">
    <erp-input-property v-for="(e,i) in model"
                        :model="e"
                        :withlabel="true"
                        :key="i">
    </erp-input-property>
  </div>
</template>

<script lang="ts">
export default {
  name: "PropertyFrom",
  props: {
    model: {
      type: Array // IProperty[]
    }
  }
}
</script>

<style lang="scss" scoped>
  .form-list {
    display: flex;
    flex-wrap: wrap;
  }
</style>
