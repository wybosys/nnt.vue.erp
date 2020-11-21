<template>
  <el-select v-model="value.tmp" clearable>
    <el-option
      v-for="(item,idx) in getOptions()"
      :key="idx"
      :label="item[0]"
      :value="item[1]">
    </el-option>
  </el-select>
</template>

<script lang="ts">

export default {
  name: "Checkbox",
  props: ['placeholder', 'value'], // value是property类型
  methods: {
    getOptions() {
      return [
        ["ON", "true"],
        ["OFF", "false"]
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.el-select .el-input__inner {
  width: 7em;
}
</style>
