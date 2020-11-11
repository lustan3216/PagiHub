<template>
  <div
    id="art-board"
    class="art-board"
  >
    <component-giver
      v-if="node"
      :id="id"
      :key="id"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import ComponentGiver from '../TemplateUtils/ComponentGiver'
import { globalDebounce, resizeListener } from '@/utils/tool'
import { getRectWithoutPadding } from '@/utils/style'

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
    this.$el.addEventListener('scroll', this.updateScrollTop)
    this.$el.addEventListener('scroll', this.handleGridResizing)

    if (!this.isExample) {
      this.offResizeListener = resizeListener(this.$el, this.setBoundaryRect)
    }
  },
  beforeDestroy() {
    this.$el.removeEventListener('scroll', this.handleGridResizing)
    this.$el.removeEventListener('scroll', this.updateScrollTop)
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
    handleGridResizing() {
      this.LAYOUT_SET({ gridResizing: true })

      globalDebounce(() => {
        this.LAYOUT_SET({ gridResizing: false })
      }, 50)
    },
    updateScrollTop() {
      if (this.isExample) return
      this.scrollTop = this.$el.scrollTop
      this.$bus.$emit('art-board-scroll-top', this.scrollTop)
    },
    setBoundaryRect() {
      const { height, width, x, y } = getRectWithoutPadding(this.$el)

      this.LAYOUT_SET({
        windowWidth: width,
        windowHeight: height,
        windowX: x,
        windowY: y
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
