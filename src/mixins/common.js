import clone from 'clone'
import store from '../store'
import editMixin from './edit'
import settingMixin from './setting'
import { mapState, mapMutations } from 'vuex'
import { appendVm, removeVm } from '../utils/vmMap'

export default {
  mixins: [editMixin, settingMixin],
  props: {
    id: {
      type: Number
    }
  },
  inject: ['isEditable'],
  data() {
    const node = store.state.nodes.currentNodesMap[this.id]
    const innerStyles = node ? clone(node.styles || {}) : {}

    return {
      innerStyles
    }
  },
  computed: {
    ...mapState('nodes', ['currentNodesMap']),
    node() {
      return this.currentNodesMap[this.id]
    }
  },
  mounted() {
    // Don't put in created to prevent some component fail before mount
    if (this.isEditable) appendVm(this)
  },
  beforeDestroy() {
    if (this.isEditable) removeVm(this.id)
  },
  methods: {
    ...mapMutations('nodes', ['APPEND_NESTED_NODES']),
    assignStyles(styles) {
      const allStyles = Object.assign({}, this.innerStyles, styles)

      const validStyles = Object.keys(allStyles).reduce((all, key) => {
        if (allStyles[key] || allStyles[key] === 0) {
          // allStyles[key] === 0 => margin: 0;
          all[key] = allStyles[key]
        }
        return all
      }, {})

      this.innerStyles = validStyles

      this.ASSIGN({
        id: this.id,
        styles: validStyles
      })
    }
  }
}
