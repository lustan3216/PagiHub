<template>
  <vue-plyr
    v-style="!isExample"
    ref="plyr"
    :options="innerProps"
    :style="innerStyles.default"
    class="h-100"
    @mouseleave="mouseleave"
  >
    <div
      :data-plyr-provider="innerProps.provider"
      :data-plyr-embed-id="innerProps.embedId"
    />
  </vue-plyr>
</template>

<script>
import nodeMixin from '@/components/Templates/mixins/node'
import { defaultSetting } from '../Setup/EditorSetting/SettingVideoPlayer'
import VuePlyr from 'vue-plyr'

export default {
  defaultSetting,
  name: 'VideoPlayer',
  components: {
    VuePlyr
  },
  mixins: [nodeMixin],
  computed: {
    player() {
      return this.$refs.plyr.player
    }
  },
  methods: {
    mouseleave() {
      this.player.pause()
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep .plyr {
  height: 100%;
}
</style>
