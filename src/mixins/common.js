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
    ...mapMutations('vmMap', ['APPEND_VM'])
  }
}
