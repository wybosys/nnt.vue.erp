<template>
  <div class="nav-wrap">
    <ul class="tabs-title" v-show="titles.length" @click.right="showList">
      <li :class="[active==index?'tab-active':'','tab','no-wrap']" v-for="(item,index) in titles"
          @click="changeTab(item,index)">
        <span>{{item.title}}</span>
        <span class="close" @click.stop="close(item,index)">×</span>
      </li>
    </ul>
    <ul v-show="list" class="tab-op" :style="tabOp">
      <li @click="closeAll">关闭所有标签页</li>
    </ul>
  </div>
</template>

<script lang="ts">
export default {
  name: "ErpNavTab",
  props: ['titles', 'active'],
  data() {
    return {
      list: false,
      pos: {x: 0, y: 0}
    }
  },
  computed: {
    tabOp() {
      return {
        background: '#fff',
        position: 'fixed',
        left: this.pos.x + 'px',
        top: this.pos.y + 'px'
      }
    }
  },
  methods: {
    close(item, index) {
      this.titles.splice(index, 1);
      let len = this.titles.length;
      let componentName = len ? this.titles[len - 1].componentName : '';
      this.$emit('changeTab', {
        componentName: componentName,
        active: this.active
      })

    },
    changeTab(item, index) {
      this.$emit('changeActiveTab', {
        componentName: item.componentName,
        active: index
      })
    },
    showList(event) {
      this.list = true;
      let pos = this.getMousePos(event);
      this.pos = pos;
    },
    closeAll() {
      // this.list = this

    },
    getMousePos(event) {
      var e = event || window.event;
      var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
      var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
      var x = e.pageX || e.clientX + scrollX;
      var y = e.pageY || e.clientY + scrollY;
      return {'x': x, 'y': y};
    }
  }
}
</script>

<style lang='scss' scoped>
  .tabs-title {
    display: flex;

    .tab {
      position: relative;
      padding: 0 20px;
      font: 20px/50px "Microsoft YaHei UI";
      border: 1px solid $color-base;
      border-radius: 2px;
      border-left: none;
      border-bottom: none;
    }

    .tab-active {
      background: #fff;
      border-bottom-color: #fff;
      color: #409EFF;
    }

    .close {
      font: 26px/1 "Microsoft YaHei UI";
    }
  }

  .tab-op {
    position: fixed;
    background: #fff;
  }

  .nav-wrap {
    padding: 20px 50px 0;
    border-bottom: 1px solid $aside-color;
  }
</style>
