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
    <main class="main">
      <ul class="tabs-title" v-show="titles.length">
        <li :class="[active==index?'tab-active':'','tab','no-wrap']" v-for="(item,index) in titles"
            @click="changeTab(item,index)">
          <span>{{item.title}}</span>
          <span class="close" @click.stop="close(item,index)">X</span>
        </li>
      </ul>
      <keep-alive>
        <component :is="currentTabComponent"></component>
      </keep-alive>
    </main>
  </div>
</template>

<script lang="ts">
  import {navMenu} from "../../config/authConfig";
  import TableUseSample from "./TableUseSample";
  import ChartUseSample from "./ChartUseSample";

  export default {
    name: "MainContent",
    components: {ChartUseSample, TableUseSample},
    data() {
      return {
        currentTabComponent: '',
        titles: [],
        active: 0,
        navMenu: '',
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
            title:title,
            componentName:componentName
          });
          this.active = this.titles.length - 1;
        } else {
          this.active = uniq;
        }
        this.currentTabComponent = componentName;
      },
      close(item,index) {
        this.titles.splice(index,1);
        let len = this.titles.length;
        if (len) {
          this.active = len - 1;
          this.currentTabComponent = this.titles[len-1].componentName;
        } else {
          this.currentTabComponent = ''
        }
      },
      changeTab(item, index) {
        this.currentTabComponent = item.componentName;
        this.active = index;
      },
      uniq(title){
        let titles = this.titles;
        let uniq = -1;
        for (let i = 0; i < titles.length; i++) {
          if (titles[i].title == title) {
            uniq = i;
            break;
          }
        }
        return uniq;
      }

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
    padding: 0 50px;
    box-sizing: border-box;
  }

  .tabs-title {
    display: flex;
    padding: 20px;
    border-bottom: 2px solid #324057;
    .tab {
      position: relative;
      margin: 0 10px;
      padding: 0 20px 0 10px;
      font: 20px/50px "Microsoft YaHei UI";
      border: 1px solid $color-base ;
      border-radius: 6px;
    }
    .tab-active {
      background: #fff;
      color: #409EFF;
    }
    .close {
      position: absolute;
      right: 0;
      padding: 4px 6px;
      font: 18px/1 "Microsoft YaHei UI";
    }
  }

</style>
