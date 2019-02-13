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
      this.router = false
      this.$nextTick(() => {
        this.router = true
      })
    }
  }
}
</script>

<style>
  #app {
    width: 100vw;
    height: 100vh;
  }
</style>
