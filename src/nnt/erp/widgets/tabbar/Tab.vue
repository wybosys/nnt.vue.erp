<template>
  <div v-show="titles.length">
    <el-tabs v-model="nowActive" type="card" closable @tab-remove="removeTab" @tab-click="changeTab">
      <el-tab-pane
        v-for="(item, index) in titles"
        :key="item.componentName"
        :label="item.title"
        :name="index+''"
      >
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
export default {
  name: "ErpTab",
  props: ['titles', 'active'],
  data() {
    return {
      nowActive: "0"
    }
  },
  watch: {
    active() {
      this.nowActive = this.active
    }
  },
  methods: {
    changeTab(e) {
      this.$emit('changeActiveTab', {
        componentName: this.titles[e.index].componentName,
        active: e.index
      });
    },
    removeTab(idx) {
      this.titles.splice(idx, 1);
      let len = this.titles.length;
      let componentName = len ? this.titles[len - 1].componentName : '';
      this.$emit('changeActiveTab', {
        componentName: componentName,
        active: len - 1
      });
    },

  }
}
</script>

<style lang='scss' scoped>

</style>
