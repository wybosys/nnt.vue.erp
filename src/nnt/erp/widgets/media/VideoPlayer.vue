<template>
  <d-player ref="player"
            @play="cbplay"
            :options="_options">
  </d-player>
</template>

<script lang="ts">

  import VueDPlayer from 'vue-dplayer'
  import 'vue-dplayer/dist/vue-dplayer.css'
  import {Video} from "../../../model/media/Video";

  export default {
    components: {
      'd-player': VueDPlayer
    },
    name: "VideoPlayer",
    props: {
      model: {
        type: Object,
        default:
          () => {
            return new Video();
          }
      }
    },
    computed: {
      _options() {
        return {
          video: {
            url: this.model.source,
            type: 'auto'
          }
        }
      },
      _player() {
        return this.$refs.player.dp
      }
    },
    methods: {
      cbplay() {
        // playing
      },
      play() {
        this._player.switchVideo({
          url: this.model.source
        })
        this._player.play()
      },
      pause() {
        this._player.pause()
      }
    }
  }

</script>
