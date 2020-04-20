import { mapMutations, mapState } from 'vuex'
import { vmAppend, vmRemove } from '@/utils/vmMap'
import { merge, cloneJson } from '@/utils/tool'
import { STYLE, PROPS, VALUE } from '@/const'

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
    ...mapState('draft', ['nodesMap']),
    node() {
      return this.nodesMap[this.id]
    },
    parentNode() {
      return this.nodesMap[this.node.parentId]
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
