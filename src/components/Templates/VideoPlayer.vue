<template>
  <div
    :style="innerStyles.html"
    class="h-100 over-hidden"
  >
    <vue-plyr
      ref="plyr"
      :options="{ ...innerProps, ratio }"
      :key="JSON.stringify({ ...innerProps, ratio })"
      class="h-100"
      @mouseleave="mouseleave"
    >
      <div
        :data-plyr-provider="innerProps.provider"
        :data-plyr-embed-id="innerProps.embedId"
      />
    </vue-plyr>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import nodeMixin from '@/components/Templates/mixins/node'
import { defaultSetting } from '../Setup/EditorSetting/SettingVideoPlayer'
import VuePlyr from 'vue-plyr'
import {
  addResizeListener,
  removeResizeListener
} from 'element-ui/src/utils/resize-event'

export default {
  defaultSetting,
  name: 'VideoPlayer',
  components: {
    VuePlyr
  },
  mixins: [nodeMixin],
  data() {
    return {
      width: 16,
      height: 9
    }
  },
  computed: {
    player() {
      return this.$refs.plyr.player
    },
    ratio() {
      return this.width + ':' + this.height
    }
  },
  mounted() {
    this.updateRatio()
    addResizeListener(this.$el, this.updateRatio)
  },
  beforeDestroy() {
    removeResizeListener(this.$el, this.updateRatio)
  },
  methods: {
    updateRatio() {
      this.height = this.$el.clientHeight
      this.width = this.$el.clientWidth
    },
    mouseleave() {
      if (this.isDraftMode) {
        this.player.pause()
      }
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep .plyr {
  height: 100%;
}
</style>
