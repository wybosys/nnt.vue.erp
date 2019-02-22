<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose">
    <el-submenu v-for="(item,index) in list" :key="index" :index = "index + ''">
      <span slot="title">{{item.label}}</span>
      <el-menu-item v-for="(subItem,idx) in item.children" :key="idx" :index="index +'-' + idx ">
        <span slot="title">{{subItem}}</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
  export default {
    name: "DropListSample",
    data() {
      return {
        list: [
          {
            label: '导航一',
            children: ["选项一","选项二","选项三","选项四"]
          },
          {
            label: '导航二',
            children: ["选项一"]
          }
        ]
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style lang='scss' scoped>

</style>
