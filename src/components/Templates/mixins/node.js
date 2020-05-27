import { mapMutations } from 'vuex'
import { vmAppend, vmRemove } from '@/utils/vmMap'
import { deepmerge, cloneJson } from '@/utils/tool'
import { STYLE, PROPS, VALUE, GRID_GENERATOR, MASTER_ID, ID } from '@/const'
import style from '@/directive/style'
import { directive } from '@/directive/freeStyle'
import { nodeIds } from '@/utils/nodeId'

let hoverNode = []
const watchOptions = { deep: true, immediate: true }

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
      innerStyles: {},
      innerProps: {}
    }
  },
  computed: {
    node() {
      return this.componentsMap[this[ID]]
    },
    masterNode() {
      const masterId = this.node[MASTER_ID]
      return masterId && this.componentsMap[masterId]
    },
    masterNodeProps() {
      if (this.masterNode) {
        return this.masterNode[PROPS] || {}
      } else {
        return {}
      }
    },
    masterNodeStyle() {
      if (this.masterNode) {
        return this.masterNode[STYLE] || {}
      } else {
        return {}
      }
    },
    innerValue() {
      return this.node && this.node[VALUE]
    }
  },
  created() {
    this.watchStyles()
    this.watchProps()
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
    ...mapMutations('app', ['CLEAN_SELECTED_COMPONENT_IDS']),
    watchStyles() {
      const path = `componentsMap.${this.id}.${STYLE}`
      const fn = (value = {}) => {
        this.innerStyles = {
          id: this.id,
          ...this.masterNodeStyle,
          ...value
        }
      }

      this.$watch(path, fn, watchOptions)
    },
    watchProps() {
      const path = `componentsMap.${this.id}.${PROPS}`
      const fn = (value = {}) => {
        const setting = cloneJson(this.$options.defaultSetting || {})
        this.innerProps = deepmerge(setting, this.masterNodeProps, value)
      }

      this.$watch(path, fn, watchOptions)
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
