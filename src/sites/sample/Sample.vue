<template>
  <div>
    <echo></echo>
    <audio-recorder></audio-recorder>
  </div>
</template>

<script lang="ts">

import Echo from "./Echo.vue";
import AudioRecorder from "./AudioRecorder.vue";

export default {
  name: "Sample",
  components: {Echo, AudioRecorder}
}
</script>

<style scoped>

</style>
