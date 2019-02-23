<template>
  <el-form :model="model" :rules="rules" ref="form">
    <slot>form items</slot>
  </el-form>
</template>

<script lang="ts">
export default {
  name: "Form",
  props: ['model', 'rules'],
  methods: {

    // 验证当前form的每一个item是否符合rule的定义
    async validate() {
      return new Promise<void>((resolve, reject) => {
        this.$refs.form.validate(res => {
          res ? resolve() : reject;
        });
      });
    }
  }
}
</script>
