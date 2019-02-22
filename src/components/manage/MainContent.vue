<template>
  <div>
    <aside class="main-aside" width="200px">
      <el-menu
        default-active="2"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-submenu v-for="item in naviTree" :key="item.id" :index="item.id + ''">
          <template slot="title">
            <span>{{item.label}}</span>
          </template>
          <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="item.id + '=' + subItem.id"
                        @click="toOtherPage(subItem)">
            {{subItem.label}}
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

import ErpTab from "../../nnt/erp/widgets/tabbar/Tab.vue";
import {Application} from "../../nnt/erp/Application";
import {TreeNode} from "../../nnt/erp/ModuleTree";

export default {
  name: "MainContent",
  components: {ErpTab},
  data() {
    return {
      currentTabComponent: '',
      titles: [],
      naviTree: null,
      active: "0"
    }
  },
  created() {
    this.naviTree = Application.shared.tree.children
  },
  methods: {
    toOtherPage(route: TreeNode) {
      let uniq = this.uniq(route.id);
      if (uniq == -1) {
        this.titles.push(route);
        this.active = this.titles.length - 1;
      } else {
        this.active = uniq;
      }
      //this.currentTabComponent = route.path;
    },
    changeActiveTab(obj:TreeNode) {
      //this.currentTabComponent;
      //this.active = obj.active;
    },
    uniq(id:number) {
      let uniq = -1;
      for (let i = 0; i < this.titles.length; i++) {
        if (this.titles[i].id == id) {
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
