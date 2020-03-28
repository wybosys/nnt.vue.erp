<template>
  <el-dialog :visible.sync="model.visible"
             :title="title"
             @close="cancel"
             center>
    <slot></slot>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">确认</el-button>
      <el-button @click="cancel">取消</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">

  import {Dialog} from "../../../model/dialog/IDialog";

  export default {
    name: "Dialog",
    props: {
      model: {
        default: () => {
          return new Dialog()
        }
      },
      title: {
        type: String
      }
    },
    methods: {
      show() {
        this.model.visible = true
        this.$emit('open');
      },
      cancel() {
        this.model.visible = false
        this.$emit('cancel');
        this.$emit('close');
      },
      confirm() {
        this.model.visible = false
        this.$emit('confirm');
        this.$emit('close');
      }
    }
  }
</script>
