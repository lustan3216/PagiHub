<template>
  <vue-plyr
    ref="plyr"
    :options="innerProps"
    :key="JSON.stringify(innerProps)"
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
import { mapMutations } from 'vuex'
import { getValueByPath } from '@/utils/tool'
import nodeMixin from '@/components/Templates/mixins/node'
import { defaultSetting } from '../Setup/EditorSetting/SettingVideoPlayer'
import VuePlyr from 'vue-plyr'
import { STYLE } from '@/const'

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
    },
    ratio() {
      const w = getValueByPath(this.node, ['parentNode', STYLE, 'ratioW'])
      const h = getValueByPath(this.node, ['parentNode', STYLE, 'ratioH'])
      return w && h ? `${w}:${h}` : '16:9'
    },
    innerProps() {
      const props = nodeMixin.computed.innerProps.call(this)
      return { ...props, ratio: this.ratio }
    }
  },
  methods: {
    ...mapMutations('node', ['RECORD']),
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
