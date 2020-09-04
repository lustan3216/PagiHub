import { vmAppend, vmRemove, vmGet } from '@/utils/vmMap'
import { cloneJson, deepMerge } from '@/utils/tool'

import { PROPS, VALUE, STYLE } from '@/const'
import FreeStyle from '@/directive/freeStyle'
import { getNode, isGrid, isGridItem } from '@/utils/node'
import { arrayFirst } from '@/utils/array'
import { getMasterId } from '@/utils/inheritance'
import { objectHasAnyKey } from '@/utils/object'

let hoverNode = []

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  inject: {
    isExample: { default: false },
    inheritance: {
      default: {
        inheritParentId: null,
        masterComponentSetId: null
      }
    }
  },
  directives: {
    FreeStyle
  },
  data() {
    return {
      childStyles: {}
    }
  },
  computed: {
    node() {
      return getNode(this.id, this.isExample)
    },
    selfStyles() {
      return this.node[STYLE] || {}
    },
    selfProps() {
      return this.node[PROPS] || {}
    },
    innerValue() {
      return this.masterNode.value || this.node[VALUE]
    },
    masterId() {
      return getMasterId(this.node)
    },
    masterNode() {
      return getNode(this.masterId) || {}
    },
    gridItemHasChild() {
      return isGridItem(this.node) && arrayFirst(this.innerChildren)
    },
    innerStyles() {
      if (isGridItem(this.node) && this.gridItemHasChild) {
        return this.childStyles
      }
      else {
        return deepMerge(this.masterNode[STYLE], this.selfStyles)
      }
    },
    innerProps() {
      const setting = cloneJson(this.$options.defaultSetting || {})
      return deepMerge.all([setting, this.masterNode[PROPS], this.selfProps])
    },
    innerGrid() {
      if (isGridItem(this.node)) {
        return deepMerge(this.masterNode.grid, this.node.grid)
      }
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

    const { parentNode } = this.node
    if (isGridItem(parentNode)) {
      this.watchStylesToUpdateParents()
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
    watch(path, fn) {
      this.$watch(path, fn, { deep: true, immediate: true })
    },
    watchStylesToUpdateParents() {
      this.watch('innerStyles', value => {
        this.$nextTick(() => {
          if (!objectHasAnyKey(value)) {
            return
          }

          const vm = vmGet(this.node.parentId, this.isExample)
          vm.childStyles = value
        })
      })
    },
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
