<template>
  <view-port>
    <layersInteract
      v-if="rootNode"
      ref="panelDraft"
      :id="rootNode.id"
      class="panel-draft"
    />
  </view-port>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ViewPort from './ViewPort'
import LayersInteract from '../Templates/LayersInteract'
import { isMac } from '@/utils/device'
import { onWithOff, asyncGetValue } from '@/utils/tool'
let off

export default {
  name: 'PanelDraft',
  components: {
    ViewPort,
    LayersInteract
  },
  computed: {
    ...mapGetters('draft', ['rootNode'])
  },
  beforeCreate() {
    this.$store.dispatch('project/getProjects')
  },
  mounted() {
    let scrollId
    asyncGetValue(() => {
      return this.$refs.panelDraft && this.$refs.panelDraft.$el
    }).then($el => {
      off = onWithOff($el, 'scroll', () => {
        this.SET({ isAnimating: true })

        window.clearTimeout(scrollId)
        scrollId = setTimeout(() => {
          this.SET({ isAnimating: false })
        }, 66)
      })
    })
  },
  beforeDestroy() {
    off()
  },
  methods: {
    ...mapMutations('app', ['SET']),
    isMac
  }
}
</script>

<style scoped lang="scss">
.panel-draft {
  overflow: auto;
  box-sizing: border-box;
  padding: 1px;
}
</style>
