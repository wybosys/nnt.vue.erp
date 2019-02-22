<template>
  <div>
    <!--inner template下只能有一个根元素-->


    <!--如果想要引用组件，则直接写该组件的名字,驼峰命名变成烤串命名,vue会自动import及放入组件中-->
    <main-container></main-container>

  </div>
</template>

<script lang="ts">
    import MainContainer from "../MainContainer";
    export default {
        name: "Base",
      components: {MainContainer}
    }
</script>

<style lang='scss' scoped>

</style>
