<template>
  <div>
    <el-menu
      default-active="2"
      @open="handleOpen"
      @close="handleClose"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">

      <el-submenu v-for="(item,key,index) in navMenu" :key="index" :index="index + ''">
        <template slot="title">
          <span>{{item.ctrName}}</span>
        </template>
        <el-menu-item v-for="(subItem,subKey,subIndex) in item.action" :key="subIndex" :index="index + '=' + subIndex"
                      @click="toOtherPage(subKey)">
          {{subItem}}
        </el-menu-item>
      </el-submenu>

    </el-menu>
  </div>
</template>

<script>
  import {navMenu} from "../../config/authConfig";

  export default {
    name: "CAside",
    data() {
      return {
        navMenu: '',
      }
    },
    created() {
      this.navMenu = navMenu;
    },
    computed: {},
    methods: {
      handleOpen(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        // console.log(key, keyPath);
      },
      toOtherPage(page) {
        this.$router.push(page)

      }
    }
  }
</script>

<style lang='scss' scoped>

</style>
