import { mapMutations } from 'vuex'
import { vmAppend, vmRemove } from '@/utils/vmMap'
import { deepmerge, cloneJson } from '@/utils/tool'
import { STYLE, PROPS, VALUE, GRID_GENERATOR, MASTER_ID, ID } from '@/const'
import style from '@/directive/style'
import { directive } from '@/directive/freeStyle'
import { nodeIds } from '@/utils/nodeId'

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
    rootComponentSetId: { default: null }
  },
  directives: {
    style,
    freeStyle: directive
  },
  data() {
    return {
      masterStyles: {},
      selfStyles: {},
      masterProps: {},
      selfProps: {}
    }
  },
  computed: {
    node() {
      return this.componentsMap[this[ID]]
    },
    innerValue() {
      return this.node && this.node[VALUE]
    },
    masterId() {
      return this.node && this.node[MASTER_ID]
    },
    innerStyles() {
      return {
        id: this.id,
        ...this.masterStyles,
        ...this.selfStyles
      }
    },
    innerProps() {
      const setting = cloneJson(this.$options.defaultSetting || {})
      return deepmerge(setting, this.masterProps, this.selfProps)
    }
  },
  created() {
    this.watchStyles()
    this.watchProps()

    if (this.masterId) {
      this.watchMasterStyles()
      this.watchMasterProps()
    }

    if (this.isDraftMode && !this.isExample) {
      nodeIds.restoreIds(this.node)
    }
  },
  mounted() {
    // Don't put in created to prevent some component fail before mount
    if (this.isDraftMode && !this.isExample) {
      vmAppend(this)
      this.$bus.$on(`hover-${this.id}`, this.hoverCover)
    }
  },
  beforeDestroy() {
    if (this.isDraftMode && !this.isExample) {
      vmRemove(this.id)
      this.$bus.$off(`hover-${this.id}`, this.hoverCover)
    }
  },
  methods: {
    watch(path, fn) {
      this.$watch(path, fn, { deep: true, immediate: true })
    },
    watchStyles() {
      this.watch(`componentsMap.${this.id}.${STYLE}`, value => {
        this.selfStyles = value || {}
      })
    },
    watchMasterStyles() {
      this.watch(`componentsMap.${this.masterId}.${STYLE}`, value => {
        this.masterStyles = value || {}
      })
    },
    watchProps() {
      this.watch(`componentsMap.${this.id}.${PROPS}`, value => {
        this.selfProps = value || {}
      })
    },
    watchMasterProps() {
      this.watch(`componentsMap.${this.masterId}.${PROPS}`, value => {
        this.masterProps = value || {}
      })
    },
    hoverCover(hover) {
      const $el =
        this.node.tag === GRID_GENERATOR ? this.$el : this.$el.parentNode

      if (hover) {
        const node = document.createElement('DIV')
        node.className = 'hover-cover'
        $el.appendChild(node)
        hoverNode.push(node)
      } else {
        hoverNode.forEach(x => x.remove())
        hoverNode = []
      }
    }
  }
}
