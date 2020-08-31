import { mapState } from 'vuex'
import { vmAppend, vmRemove, vmGet } from '@/utils/vmMap'
import { objectAssign } from '@/utils/object'
import { cloneJson } from '@/utils/tool'

import { PROPS, VALUE, MASTER_ID, ID, STYLE } from '@/const'
import FreeStyle from '@/directive/freeStyle'
import { getNode, isGrid, isGridItem } from '@/utils/node'
import { arrayFirst } from '@/utils/array'
window.objectAssign = objectAssign
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
  directives: {
    FreeStyle
  },
  data() {
    return {
      childStyles: {},
      masterStyles: {},
      masterProps: {},
      masterValue: null
    }
  },
  computed: {
    ...mapState('example', ['exampleComponentsMap']),
    node() {
      return getNode(this.id)
    },
    selfStyles() {
      return this.node[STYLE] || {}
    },
    selfProps() {
      return this.node[PROPS] || {}
    },
    innerValue() {
      return this.masterValue || this.node[VALUE]
    },
    masterId() {
      return this.node && this.node[MASTER_ID]
    },
    firstChild() {
      return isGridItem(this.node) && arrayFirst(this.innerChildren)
    },
    innerStyles() {
      if (isGridItem(this.node) && this.firstChild) {
        return this.childStyles
      }
      else {
        const defaultStyle = objectAssign(
          {},
          this.masterStyles.default,
          this.selfStyles.default
        )
        return { default: defaultStyle }
      }
    },
    innerProps() {
      const setting = cloneJson(this.$options.defaultSetting || {})
      return objectAssign(setting, this.masterProps, this.selfProps)
    },
    currentMapString() {
      return this.isExample ? 'exampleComponentsMap' : 'componentsMap'
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

    if (this.masterId) {
      this.watchMasterStyles()
      this.watchMasterProps()
      this.watchMasterValue()
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
          const vm = vmGet(this.node.parentId, this.isExample)
          vm.childStyles = value || {}
        })
      })
    },
    // watchStyles() {
    //   const path = `${this.currentMapString}.${this.id}.${STYLE}`
    //   this.watch(path, value => {
    //     this.selfStyles = value || {}
    //   })
    // },
    watchMasterStyles() {
      const path = `${this.currentMapString}.${this.masterId}.${STYLE}`
      this.watch(path, value => {
        this.masterStyles = value || {}
      })
    },
    // watchProps() {
    //   const path = `${this.currentMapString}.${this.id}.${PROPS}`
    //   this.watch(path, value => {
    //     this.selfProps = value || {}
    //   })
    // },
    watchMasterProps() {
      const path = `${this.currentMapString}.${this.masterId}.${PROPS}`
      this.watch(path, value => {
        this.masterProps = value || {}
      })
    },
    watchMasterValue() {
      const path = `${this.currentMapString}.${this.masterId}.value`
      this.watch(path, value => {
        this.masterValue = value || {}
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
