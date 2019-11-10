import clone from 'clone'
import store from '../store'
import editMixin from './edit'
import { mapState, mapMutations } from 'vuex'
import { appendVm } from '../utils/vmMap'
import { onSettingChange } from '../buses/settings'
import { onVisibleChange } from '../buses/visibility'

export default {
  mixins: [editMixin],
  props: {
    id: {
      type: Number,
      required: true
    },
    isEditable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    let innerStyles = {}

    if (this.isEditable) {
      const node = store.state.nodes.currentNodesMap[this.id]
      innerStyles = clone(node.styles || {})
    }

    return {
      innerStyles
    }
  },
  computed: {
    ...mapState('nodes', ['currentNodesMap']),
    node() {
      return this.currentNodesMap[this.id]
    },
    parentId() {
      return this.node.parentId
    }
  },
  created() {
    if (this.isEditable) {
      appendVm(this)

      onSettingChange(this.id, ({ styles }) => {
        this.innerStyles = styles
      })

      onVisibleChange(this.id, ({ visible }) => {
        this.$el.style.visibility = visible ? '' : 'hidden'
      })
    }
  },
  methods: {
    ...mapMutations('nodes', ['APPEND_NESTED_NODES']),
    assignStyles(styles) {
      const allStyles = Object.assign({}, this.innerStyles, styles)

      const validStyles = Object.keys(allStyles).reduce((all, key) => {
        if (allStyles[key]) all[key] = allStyles[key]
        return all
      }, {})

      this.innerStyles = validStyles

      this.ASSIGN_STYLE({
        id: this.id,
        styles: validStyles
      })
    }
  }
}
