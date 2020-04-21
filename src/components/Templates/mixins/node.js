import { mapMutations, mapState } from 'vuex'
import { vmAppend, vmRemove } from '@/utils/vmMap'
import { merge, cloneJson } from '@/utils/tool'
import { STYLE, PROPS, VALUE, GRID_GENERATOR } from '@/const'

let hoverNode

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
    ...mapState('app', ['hoverComponentId']),
    hover() {
      return this.hoverComponentId === this.id
    },
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
      return merge(setting, (this.node && this.node[PROPS]) || {})
    }
  },
  watch: {
    hover(hover) {
      const $el =
        this.node.tag === GRID_GENERATOR ? this.$el : this.$el.parentNode

      if (hover) {
        hoverNode = document.createElement('DIV')
        hoverNode.className = 'hover-cover'
        $el.appendChild(hoverNode)
      } else {
        $el.removeChild(hoverNode)
      }
    }
  },
  mounted() {
    // Don't put in created to prevent some component fail before mount
    if (this.isDraftMode && !this.isExample) vmAppend(this)
  },
  beforeDestroy() {
    if (this.isDraftMode && !this.isExample) vmRemove(this.id)
  },
  methods: {
    ...mapMutations('app', ['CLEAN_SELECTED_COMPONENT_IDS']),
    ...mapMutations('draft', ['RECORD']),
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
