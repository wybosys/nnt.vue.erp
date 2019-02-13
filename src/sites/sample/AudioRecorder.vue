<template>
  <div>
    <span>audio</span>
    <button @click="actStart">start</button>
    <button @click="actStop">stop</button>
    <label>{{resp}}</label>
  </div>
</template>

<script lang="ts">

import {AudioRecorder} from "../../nnt/Audio";
import {AudiostoreUpload} from "../../app/devops-media-apis";
import {Get} from "../../nnt/RestSession";

export default {
  name: "AudioRecorder",
  data() {
    return {
      avaliable: "",
      resp: null
    }
  },
  mounted() {
    AudioRecorder.IsValid(sup => {
      if (sup) {
        this.recorder = new AudioRecorder();
        this.resp = "enable";
      } else {
        this.resp = "disable";
      }
    });
  },
  methods: {
    actStart() {
      if (!this.recorder)
        return;
      this.recorder.start();
      this.resp = "recording";
    },
    actStop() {
      if (!this.recorder)
        return;
      this.recorder.stop(media => {
        this.resp = "waiting";
        // 保存到服务器
        let m = AudiostoreUpload();
        m.file = media;
        Get(m).then(m => {
          this.resp = m.path;
        });
      });
    }
  }
}
</script>

<style scoped>

</style>
