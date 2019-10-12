import store from '../store'
import clone from 'clone'
import editBarMixin from '../mixins/editBar'
import { mapState, mapMutations } from 'vuex'
import { onSettingChange } from '../buses/settings'
import { onVisibleChange } from '../buses/visibility'

export default {
  mixins: [editBarMixin],
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
      innerStyles = clone(node.styles)
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
      onSettingChange(this.id, ({ styles }) => {
        this.innerStyles = styles
      })
    }
  },
  mounted() {
    if (this.isEditable) {
      onVisibleChange(this.id, ({ visible }) => {
        this.$el.style.visibility = visible ? '' : 'hidden'
      })
    }
  },
  methods: {
    ...mapMutations('nodes', ['APPEND_NESTED_NODES'])
  }
}
