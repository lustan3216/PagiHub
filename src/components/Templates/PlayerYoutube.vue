<template>
  <youtube
    :video-id="videoId"
    :player-vars="playerVars"
    :width="width"
    :height="height" />
</template>

<script>
import VueYoutube from 'vue-youtube'
import childrenMixin from '../../mixins/children'
import commonMixin from '../../mixins/common'
import EditBar from '../Components/EditBar'
import EditArea from '../Components/EditArea'

export default {
  name: 'PlayerYoutube',
  components: {
    VueYoutube,
    EditBar,
    EditArea
  },
  mixins: [commonMixin, childrenMixin],
  data() {
    return {
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
  created() {
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.edit-area {
  height: 100%;
}
</style>
