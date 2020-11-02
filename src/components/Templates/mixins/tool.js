import { vmAppend, vmRemove } from '@/utils/vmMap'

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
    this.init()
  },
  beforeDestroy() {
    if (this.isDraftMode) {
      vmRemove(this, this.isExample)

      if (!this.isExample) {
        this.$bus.$off(`hover-${this.id}`, this.hoverCover)
      }
    }
  },
  methods: {
    init() {
      // Don't put in created to prevent some component fail before mount
      if (this.isDraftMode) {
        // for componentOperator using
        this.$el.id = this.id

        vmAppend(this, this.isExample)

        if (!this.isExample) {
          this.$bus.$on(`hover-${this.id}`, this.hoverCover)
        }
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
