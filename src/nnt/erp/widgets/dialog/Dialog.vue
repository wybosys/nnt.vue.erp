<template>
  <div class="message-box">
    <div class="content">
      <div class="flex-between-container header">
        <span>{{text}}</span>
        <span @click="exit">×</span>
      </div>
      <slot></slot>
      <div class="flex-around-container">
        <el-button type="primary" @click="sure">确定</el-button>
        <el-button type="warning" @click="exit">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "ErpDialog",
  props: ["text"],
  methods: {
    exit() {
      this.$emit('exitDialog')
    },
    sure() {
      this.$emit('saveDialog')
    }
  }
}
</script>

<style lang='scss' scoped>
  .message-box {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 9999999;

    .content {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      padding: 50px;
      box-shadow: 0 0 2px $color-base;
      border-radius: 5px;
    }

    .header {
      font: bold 30px/60px "Microsoft YaHei UI";
    }

    .list {
      padding-bottom: 20px;
      font: 20px/40px "Microsoft YaHei UI";

      li {
        border-bottom: 2px solid $color-base;
      }
    }
  }
</style>
