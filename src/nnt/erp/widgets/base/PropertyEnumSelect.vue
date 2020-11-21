<template>
  <el-select v-model="value.tmp" clearable>
    <el-option
      v-for="(item,idx) in getOptions()"
      :key="idx"
      :label="item"
      :value="item">
    </el-option>
  </el-select>
</template>

<script lang="ts">
import {EnumT} from "../../../core/EnumT";
import {VariantMajorType} from "../../../core/Variant";

export default {
  name: "PropertyEnumSelect",
  props: ['placeholder', 'value'], // value是property类型
  methods: {
    getOptions() {
      let typ = this.value.type
      if (typ.major != VariantMajorType.ENUM) {
        return [];
      }

      // value保存枚举对应的类型定义
      let em: EnumT = typ.value;
      return em.defines;
    }
  }
}
</script>
