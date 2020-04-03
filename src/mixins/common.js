import { mapGetters, mapMutations, mapState } from 'vuex'
import { vmAppend, vmRemove } from '../utils/vmMap'
import { merge, cloneJson } from '../utils/tool'
import { STYLES, PROPS } from '../const'

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
    ...mapGetters('draft', ['childrenOf', 'parentPath']),
    node() {
      return this.nodesMap[this.id]
    },
    innerStyles() {
      return this.node && this.node[STYLES] || {}
    },
    innerProps() {
      const setting = cloneJson(this.$options.defaultSetting)
      return merge(setting, this.node && this.node[PROPS] || {})
    }
  },
  mounted() {
    // Don't put in created to prevent some component fail before mount
    if (this.isDraftMode) vmAppend(this)
  },
  beforeDestroy() {
    if (this.isDraftMode) vmRemove(this.id)
  },
  methods: {
    ...mapMutations('app', ['CLEAN_SELECTED_COMPONENT_IDS']),
    ...mapMutations('draft', ['RECORD']),
    assignStyles(styles) {
      this.RECORD([
        {
          path: this.id,
          value: { [STYLES]: styles }
        }
      ])
    },

    assignProps(props) {
      this.RECORD([
        {
          path: this.id,
          value: { [PROPS]: props }
        }
      ])
    }
  }
}
