import { vmAppend, vmRemove } from '@/utils/vmMap'
import { isBackground, isSlider } from '@/utils/node'

let hoverNode = []

export default {
  props: {
    id: {
      type: String
    }
  },
  inject: {
    isExample: { default: false }
  },
  computed: {
    node() {
      return this.nodesMap[this.id]
    }
  },
  activated() {
    this.init()
  },
  update() {
    this.init()
  },
  mounted() {
    this.$nextTick(() => {
      // undo在redo 的時候 如果不放nextTick, 不知為啥 beforeDestroy這個會跑在mounted 前面
      this.init()
    })
  },
  beforeDestroy() {
    vmRemove(this, this.isExample)

    if (!this.isExample) {
      this.$bus.$off(`hover-${this.id}`, this.hoverCover)
    }
  },
  methods: {
    percentUnitW() {
      // for @/utils/layout unitConvert only
      if (isBackground(this.node) || isSlider(this.node)) {
        return this.$el.clientWidth / 100
      }

      return (this.$refs.gridItem.containerWidth || 0) / 100
    },
    percentUnitH() {
      // for @/utils/layout unitConvert only
      if (isBackground(this.node) || isSlider(this.node)) {
        return this.$el.clientHeight / 100
      }

      return this.$refs.gridItem.containerHeight / 100
    },
    init() {
      // Don't put in created to prevent some component fail before mount
      // for componentOperator using
      this.$el.id = this.id

      vmAppend(this, this.isExample)

      if (!this.isExample) {
        this.$bus.$on(`hover-${this.id}`, this.hoverCover)
      }
    },
    hoverCover(hover) {
      if (!this.node) {
        return
      }

      if (hover) {
        const node = document.createElement('DIV')
        node.className = 'hover-cover'
        this.$el.appendChild(node)
        hoverNode.push(node)
      }
      else {
        hoverNode.forEach(x => x.remove())
        hoverNode = []
      }
    }
  }
}
