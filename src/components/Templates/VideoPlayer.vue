<template>
  <div class="h-100" @mouseleave="mouseleave" />
</template>

<script>
import childrenMixin from '../../mixins/children'
import commonMixin from '../../mixins/common'
import { defaultSetting } from '../../settings/videoPlayer'
// var videojs = require('../../video.js/dist/video.cjs.js');

export default {
  defaultSetting,
  name: 'PlayerYoutube',
  mixins: [commonMixin, childrenMixin],
  data() {
    return {
      recreate: null,
      playerOptions: {
        playbackRates: [0.5, 0.7, 1.0, 1.5, 1.7, 2.0],
        techOrder: ['html5', 'youtube']
      }
    }
  },
  computed: {
    options() {
      const type = src =>
        src.includes('youtube.com') ? 'video/youtube' : 'video/mp4'
      const { src1, src2 } = this.innerProps
      const source = {
        sources: [
          { type: type(src1), src: src1 },
          { type: type(src2), src: src2 }
        ]
      }
      return Object.assign(this.playerOptions, source, this.innerProps)
    },
    player() {
      // return this.$refs.videoPlayer.player
    }
  },
  watch: {
    options: {
      handler() {
        this.recreate = +new Date()
      },
      deep: true
    }
  },
  methods: {
    mouseleave() {
      // this.player.pause()
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
