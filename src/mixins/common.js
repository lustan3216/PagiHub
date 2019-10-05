import store from '../store'
import clone from 'clone'
import { mapGetters, mapState, mapMutations } from 'vuex'
import { onSettingChange } from '../buses/settings'
import { onVisibleChange } from '../buses/visibility'

export default {
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
    const node = store.state.nodes.currentNodesMap[this.id]

    return {
      innerStyles: clone(node.styles)
    }
  },
  computed: {
    ...mapState('nodes', ['currentNodesMap']),
    ...mapGetters('nodes', ['childrenFrom']),
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
