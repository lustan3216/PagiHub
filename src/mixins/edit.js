import clone from 'clone'
import { mapGetters, mapMutations } from 'vuex'
import { onEditBarFn, emitCloseEditBar } from '../buses/editBar'
import { resetNestedIds } from '../utils/keyId'
import { isEditBarVisible, openEditBarById } from '../buses/editBar'
import { camelCase } from '../lodash'

const templates = require('../templates')

export default {
  computed: {
    ...mapGetters('nodes', ['childrenOf']),
    childrenIds() {
      return this.innerChildren.map(x => x.id)
    },
    isEditBarVisible() {
      return id => isEditBarVisible(id)
    }
  },
  created() {
    if (this.isEditable) {
      onEditBarFn(this.id, ({ type, childId }) => {
        this[type](childId)
      })
    }
  },
  methods: {
    openEditBarById,
    ...mapMutations('nodes', ['APPEND_NODE', 'ASSIGN_STYLES']),
    ...mapMutations('layout', ['CLOSE_SIDEBAR', 'OPEN_SIDEBAR']),
    // https://vuejs.org/v2/api/#vm-watch ，這裡一定都要clone不然watch裡面新舊值會一樣
    new(childId) {
      const index = this.childrenIds.indexOf(childId)
      const clonedChildren = clone(this.innerChildren)
      const tag = camelCase(this.innerChildren[index].tag)
      const _node = templates[tag] ? templates[tag]() : clone(clonedChildren[index])
      const { children, styles, ...node } = _node

      resetNestedIds(node)

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
      resetNestedIds(clonedNode)

      this.APPEND_NODE({
        node: clonedNode,
        parentId: this.id
      })

      const { children, ..._node } = clonedNode // try to unify innerChildren's child doesn't have chidlren key

      clonedChildren.unshift(_node)
      this.innerChildren = clonedChildren
    },
    remove(childId) {
      const index = this.childrenIds.indexOf(childId)
      const cloneChildren = clone(this.innerChildren)
      cloneChildren.splice(index, 1)
      this.innerChildren = cloneChildren
      emitCloseEditBar()
    },
    setting() {
      this.CLOSE_SIDEBAR()
      this.$nextTick(() => {
        this.OPEN_SIDEBAR('SidebarSettings', { id: this.id })
      })
    }
  }
}
