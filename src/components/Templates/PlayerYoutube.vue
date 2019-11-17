<template>
  <div class="h-100" @click="noClick = false" @mouseleave="mouseleave">
    <!-- iframe 創建後不能修改，所以多一層中介層 -->
    <div :class="{ 'no-click': noClick }" :style="innerStyles" class="h-100">
      <youtube
        ref="youtube"
        :video-id="videoId"
        :player-vars="playerVars"
        :width="width"
        :height="height"
      />
    </div>
  </div>
</template>

<script>
import VueYoutube from 'vue-youtube'
import childrenMixin from '../../mixins/children'
import commonMixin from '../../mixins/common'

export default {
  name: 'PlayerYoutube',
  components: {
    VueYoutube
  },
  mixins: [commonMixin, childrenMixin],
  data() {
    return {
      noClick: true,
      videoId: 'lG0Ys-2d4MA',
      playerVars: {
        autoplay: 0,
        fitParent: true
      },
      width: '100%',
      height: '100%'
    }
  },
  computed: {
    player() {
      return this.$refs.youtube.player
    }
  },
  methods: {
    mouseleave() {
      this.noClick = true
      this.player.stopVideo()
    }
  }
}
</script>
