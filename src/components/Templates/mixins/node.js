import { mapMutations } from 'vuex'
import { vmAppend, vmRemove } from '@/utils/vmMap'
import { deepmerge, cloneJson } from '@/utils/tool'
import { STYLE, PROPS, VALUE, GRID_LAYOUT } from '@/const'

let hoverNode = []

export default {
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  inject: {
    isExample: { default: false }
  },
  computed: {
    node() {
      return this.draftNodesMap[this.id]
    },
    innerValue() {
      return this.node && this.node[VALUE]
    },
    innerStyles() {
      return (this.node && this.node[STYLE]) || {}
    },
    innerProps() {
      const setting = cloneJson(this.$options.defaultSetting || {})
      return deepmerge(setting, (this.node && this.node[PROPS]) || {})
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
    ...mapMutations('draft', ['RECORD']),
    hoverCover(hover) {
      const $el =
        this.node.tag === GRID_LAYOUT ? this.$el : this.$el.parentNode

      if (hover) {
        const node = document.createElement('DIV')
        node.className = 'hover-cover'
        $el.appendChild(node)
        hoverNode.push(node)
      } else {
        hoverNode.forEach(x => x.remove())
        hoverNode = []
      }
    },
    assignStyles(styles) {
      this.RECORD([
        {
          path: `${this.id}.${STYLE}`,
          value: styles
        }
      ])
    }
  }
}
