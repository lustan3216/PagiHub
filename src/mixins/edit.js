import clone from 'clone'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { draftIds } from '../utils/keyId'

const templates = require('../template/basic')

export default {
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    ...mapGetters('nodes', ['childrenOf']),
    childrenIds() {
      return this.innerChildren.map(x => x.id)
    }
  },
  methods: {
    ...mapMutations('app', ['CLEAN_SELECTED_COMPONENT_IDS']),
    ...mapMutations('nodes', ['APPEND_NODE', 'ASSIGN']),
    // https://vuejs.org/v2/api/#vm-watch ，這裡一定都要clone不然watch裡面新舊值會一樣
    new(childId) {
      const index = this.childrenIds.indexOf(childId)
      const clonedChildren = clone(this.innerChildren)
      const tag = this.innerChildren[index].tag.camelCase()
      const _node = templates[tag]
        ? templates[tag]()
        : clone(clonedChildren[index])
      const { children, styles, ...node } = _node

      draftIds.resetNestedIds(node)

      this.APPEND_NODE({
        node,
        parentId: this.id
      })

      clonedChildren.unshift(node)
      this.innerChildren = clonedChildren
    },
    copy(childId) {
      // Use childrenOf here deu to get the whole nested chidlren tree to APPEND_NODE
      const node = this.childrenOf[this.id].find(x => x.id === childId)
      const clonedChildren = clone(this.innerChildren)
      const clonedNode = clone(node)
      draftIds.resetNestedIds(clonedNode)

      this.APPEND_NODE({
        node: clonedNode,
        parentId: this.id
      })

      const { children, ..._node } = clonedNode // try to unify innerChildren's child doesn't have chidlren key

      clonedChildren.unshift(_node)
      this.innerChildren = clonedChildren
    },
    remove(childId) {
      if (this.selectedComponentIds.includes(this.id)) {
        this.CLEAN_SELECTED_COMPONENT_IDS()
      }
      const index = this.childrenIds.indexOf(childId)
      const cloneChildren = clone(this.innerChildren)
      cloneChildren.splice(index, 1)
      this.innerChildren = cloneChildren
    }
  }
}
