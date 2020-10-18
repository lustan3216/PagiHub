import { vmAppend, vmRemove } from '@/utils/vmMap'
import { cloneJson, deepMerge } from '@/utils/tool'
import { PROPS, VALUE, STYLES } from '@/const'
import { getNode, isGrid, isGridItem } from '@/utils/node'

let hoverNode = []

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  inject: {
    isExample: { default: false }
  },
  computed: {
    node() {
      return getNode(this.id, this.isExample)
    },
    innerValue() {
      return this.node[VALUE]
    },
    innerStyles() {
      return this.node[STYLES] || {}
    },
    innerProps() {
      const setting = cloneJson(this.$options.defaultSetting || {})
      return deepMerge(setting, this.node[PROPS])
    }
  },
  mounted() {
    // Don't put in created to prevent some component fail before mount
    if (this.isDraftMode) {
      vmAppend(this, this.isExample)

      if (!this.isExample) {
        this.$bus.$on(`hover-${this.id}`, this.hoverCover)
      }
    }
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
    hoverCover(hover) {
      if (!this.node) {
        return
      }

      const $el = isGrid(this.node) ? this.$el : this.$el.parentNode

      if (hover) {
        const node = document.createElement('DIV')
        node.className = 'hover-cover'
        $el.appendChild(node)
        hoverNode.push(node)
      }
      else {
        hoverNode.forEach(x => x.remove())
        hoverNode = []
      }
    }
  }
}
