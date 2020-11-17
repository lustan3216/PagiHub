<template>
  <div
    id="art-board"
    class="art-board"
  >
    <portal-target
      name="ArtBoard"
      multiple
    />
    <component-giver
      v-if="node"
      :id="id"
      :key="id"
    />
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import ComponentGiver from '../TemplateUtils/ComponentGiver'
import { debounce, throttle, resizeListener } from '@/utils/tool'
import { findBreakpoint } from '@/utils/layout'

export default {
  name: 'ArtBoard',
  components: {
    ComponentGiver
  },
  inject: {
    isExample: { default: false }
  },
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      scrollTop: 0,
      offResizeListener: null
    }
  },
  computed: {
    ...mapState('layout', ['gridResizing', 'scaleRatio']),
    ...mapGetters('layout', ['breakpointsMap']),
    node() {
      return this.nodesMap[this.id]
    }
  },
  watch: {
    gridResizing() {
      this.setBoundaryRect()
    },
    scaleRatio() {
      this.setBoundaryRect()
    }
  },
  mounted() {
    this.$el.addEventListener('scroll', this.onScroll)
    this.setBoundaryRect()
    if (!this.isExample) {
      this.offResizeListener = resizeListener(this.$el, this.setBoundaryRect)
    }
  },
  beforeDestroy() {
    this.$el.removeEventListener('scroll', this.onScroll)
    if (this.offResizeListener) {
      this.offResizeListener()
    }
  },
  activated() {
    if (this.scrollTop) {
      const page = this.$el
      page.scrollTop = this.scrollTop
    }
  },
  methods: {
    ...mapMutations('layout', { LAYOUT_SET: 'SET' }),
    onScroll: throttle(function() {
      this.LAYOUT_SET({ scrolling: true })

      this.scrollingEnd()
    }, 100),

    scrollingEnd: debounce(function() {
      this.LAYOUT_SET({ scrolling: false })

      if (this.isExample) return
      this.scrollTop = this.$el.scrollTop
      this.$bus.$emit('artBoardScrollTop', this.scrollTop)
    }, 150),

    setBoundaryRect() {
      const { clientWidth, clientHeight } = this.$el

      this.LAYOUT_SET({
        currentBreakpoint: findBreakpoint(this.breakpointsMap, clientWidth),
        windowWidth: Math.round(clientWidth * this.scaleRatio),
        windowHeight: Math.round(clientHeight * this.scaleRatio)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.art-board {
  overflow: scroll;
  background-color: #fff;
  height: 100%;
}
</style>
