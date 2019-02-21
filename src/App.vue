<template>
  <div id="app">
    <router-view v-if="router"/>
  </div>
</template>

<script lang="ts">
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      router: true
    }
  },
  methods: {
    reload() {
      this.router = false;
      this.$nextTick(() => {
        this.router = true
      })
    }
  }
}
</script>

<style>
  #app {
    width: auto;
    height: auto;
    overflow: hidden;
  }
</style>
