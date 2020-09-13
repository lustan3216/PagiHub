import { vmAppend, vmRemove, vmGet } from '@/utils/vmMap'
import { cloneJson, deepMerge } from '@/utils/tool'

import { PROPS, VALUE, STYLES, SOFT_DELETE } from '@/const'
import FreeStyle from '@/directive/freeStyle'
import { getNode, isGrid, isGridItem, isLayers } from '@/utils/node'
import { arrayFirst } from '@/utils/array'
import {
  getMasterId,
  isInstanceChild
} from '@/utils/inheritance'
import { objectHasAnyKey } from '@/utils/object'
import { inheritanceObject } from '@/components/TemplateUtils/InheritanceController'
import { mapMutations } from 'vuex'
import store from '@/store'

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
      default: inheritanceObject()
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
      return this.node[STYLES] || {}
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
      if (
        isGridItem(this.node) &&
        this.gridItemHasChild &&
        !isLayers(this.gridItemHasChild)
      ) {
        return this.childStyles
      }
      else {
        return deepMerge(this.masterNode[STYLES], this.selfStyles)
      }
    },
    innerProps() {
      const setting = cloneJson(this.$options.defaultSetting || {})
      return deepMerge.all([setting, this.masterNode[PROPS], this.selfProps])
    },
    innerGrid() {
      if (isInstanceChild(this.node)) {
        return this.masterNode.grid
      }
      else if (isGridItem(this.node)) {
        return deepMerge(this.masterNode.grid, this.node.grid)
      }
    }
  },
  // watch: {
  //   'masterNode.softDelete': {
  //     handler(value) {
  //       // console.log(this.masterNode[SOFT_DELETE], this.id)
  //       // if (value) {
  //       //   this.IRREVERSIBLE_RECORD([
  //       //     {
  //       //       path: `${this.id}.deletedInheritance`,
  //       //       value: cloneJson(this.node.inheritance)
  //       //     },
  //       //     {
  //       //       path: `${this.id}.inheritance`,
  //       //       value: undefined
  //       //     }
  //       //   ])
  //       // }
  //       // else if (this.node.deletedInheritance) {
  //       //   this.IRREVERSIBLE_RECORD([
  //       //     {
  //       //       path: `${this.id}.deletedInheritance`,
  //       //       value: undefined
  //       //     },
  //       //     {
  //       //       path: `${this.id}.inheritance`,
  //       //       value: cloneJson(this.node.deletedInheritance)
  //       //     }
  //       //   ])
  //       // }
  //     }
  //   }
  // },
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
    ...mapMutations('node', ['RECORD', 'IRREVERSIBLE_RECORD']),
    becomeMaster() {
      this.RECORD({
        path: `${this.id}.inheritance`,
        value: { isMasterParent: true }
      })
    },
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
