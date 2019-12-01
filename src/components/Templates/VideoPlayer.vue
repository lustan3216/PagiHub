<template>
  <div class="h-100" @mouseleave="mouseleave">
    <video-player
      ref="videoPlayer"
      :style="innerStyles"
      :options="playerOptions"
      class="h-100 player flex-center vjs-big-play-centered"
    />
  </div>
</template>

<script>
import 'video.js/dist/video-js.css'
require('videojs-youtube')
import { videoPlayer } from 'vue-video-player'
import childrenMixin from '../../mixins/children'
import commonMixin from '../../mixins/common'
// var videojs = require('../../video.js/dist/video.cjs.js');

export default {
  name: 'PlayerYoutube',
  components: {
    videoPlayer
  },
  mixins: [commonMixin, childrenMixin],
  data() {
    return {
      playerOptions: {
        start: 0,
        playsinline: false,
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        techOrder: ['html5', 'youtube'],
        sources: [
          {
            type: 'video/youtube',
            src: '//www.youtube.com/watch?v=nmcdLOjGVzw'
          },
          {
            type: 'video/mp4',
            src:
              'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm'
          }
        ],
        poster: '/static/images/author.jpg'
      }
    }
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    }
  },
  methods: {
    mouseleave() {
      this.player.pause()
    }
  }
}
</script>
<style scoped>
.player {
  overflow: hidden;
}
::v-deep.player .video-js {
  height: 100%;
  width: 100%;
}
</style>
