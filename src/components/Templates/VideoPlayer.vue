<template>
  <vue-plyr
    v-free-style="innerStyles"
    ref="plyr"
    :options="transformedProps"
    :key="JSON.stringify(transformedProps)"
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
      const { defaultW, defaultH } = this.innerProps.ratio
      const w = getValueByPath(this.node, 'parentNode.props.ratio.w', defaultW)
      const h = getValueByPath(this.node, 'parentNode.props.ratio.h', defaultH)
      return `${w}:${h}`
    },
    transformedProps() {
      return { ...this.innerProps, ratio: this.ratio }
    }
  },
  created() {
    if (this.isExample) {
      return
    }
    const { props = {}} = this.node && this.node.parentNode
    if (!props.ratio || !props.ratio.w) {
      this.RECORD({
        path: `${this.node.parentId}.props.ratio`,
        value: this.innerProps.ratio
      })
    }
  },
  methods: {
    ...mapMutations('component', ['RECORD']),
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
