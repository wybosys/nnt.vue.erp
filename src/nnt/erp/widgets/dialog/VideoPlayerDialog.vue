<template>
  <erp-dialog ref="dlg"
              :title="title"
              @open="cbOpen"
              @cancel="cbCancel"
              @confirm="cbConfirm"
              @close="cbClose">
    <erp-videoplayer ref="vp"
                     :model="model"
                     style="width: 600px;height: 600px;margin-left: auto;margin-right: auto;">
    </erp-videoplayer>
  </erp-dialog>
</template>

<script lang="ts">
  import {Video} from "../../../model/media/Video";

  export default {
    name: "VideoPlayerDialog",
    props: {
      model: {
        type: Object,
        default: () => {
          return new Video()
        }
      },
      title: {
        type: String
      }
    },
    methods: {
      cbOpen(event) {
        this.$emit('open', event)
        setTimeout(() => {
          this.$refs.vp.play()
        }, 300)
      },
      cbCancel(event) {
        this.$emit('cancel', event)
      },
      cbConfirm(event) {
        this.$emit('confirm', event)
      },
      cbClose(event) {
        this.$emit('close', event)
        this.$refs.vp.pause()
      },
      show() {
        this.$refs.dlg.show()
      },
      cancel() {
        this.$refs.dlg.cancel()
      },
      confirm() {
        this.$refs.dlg.confirm()
      }
    }
  }
</script>
