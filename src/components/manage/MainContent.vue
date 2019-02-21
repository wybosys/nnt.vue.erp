<template>
  <div>
    <aside class="main-aside" width="200px">
      <el-menu
        default-active="2"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-submenu v-for="(item,key,index) in navMenu" :key="index" :index="index + ''">
          <template slot="title">
            <span>{{item.ctrName}}</span>
          </template>
          <el-menu-item v-for="(subItem,subKey,subIndex) in item.action" :key="subIndex" :index="index + '=' + subIndex"
                        @click="toOtherPage(subKey,subItem)">
            {{subItem}}
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </aside>
    <main class="main" @click.right.prevent="">
      <erp-tab :titles="titles" @changeActiveTab="changeActiveTab" :active="active + ''"></erp-tab>
      <div class="main-content">
        <keep-alive>
          <component :is="currentTabComponent"></component>
        </keep-alive>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import {navMenu} from "./authConfig";
import TableUseSample from "./TableUseSample";
import ChartUseSample from "./ChartUseSample";
import ErpTab from "../../nnt/erp/widgets/tabbar/Tab.vue";

export default {
  name: "MainContent",
  components: {ErpTab, ChartUseSample, TableUseSample},
  data() {
    return {
      currentTabComponent: '',
      titles: [],
      navMenu: '',
      active: "0"
    }
  },
  created() {
    this.navMenu = navMenu;
  },
  methods: {
    toOtherPage(componentName, title) {
      let uniq = this.uniq(title);
      if (uniq == -1) {
        this.titles.push({
          title: title,
          componentName: componentName
        });
        this.active = this.titles.length - 1;
      } else {
        this.active = uniq;
      }
      this.currentTabComponent = componentName;
    },
    changeActiveTab(obj) {
      this.currentTabComponent = obj.componentName;
      this.active = obj.active;
    },
    uniq(title) {
      let titles = this.titles;
      let uniq = -1;
      for (let i = 0; i < titles.length; i++) {
        if (titles[i].title == title) {
          uniq = i;
          break;
        }
      }
      return uniq;
    },
  }
}
</script>

<style lang='scss' scoped>
  .main-aside {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background-color: $aside-color;
    color: #fff;
    text-align: center;
    line-height: 200px;
    width: 300px;
    height: 100%;
  }

  .main {
    position: absolute;
    left: 300px;
    right: 0;
    top: 0;
    bottom: 0;
    box-sizing: border-box;

    .main-content {
      padding: 0 50px;
    }
  }
</style>
