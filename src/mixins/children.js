import clone from 'clone'
import { appendId } from '../utils/keyId'

export default {
  props: {
    children: {
      type: Array,
      default() {
        return []
      }
    },
    id: {
      type: Number,
      required: true
    },
    parentId: {
      type: Number,
      required: true
    }
  },
  watch: {
    innerChildren(value) {
      console.log(this, this.parentId, value)
    }
  },
  data() {
    const innerChildren = clone(this.children).sort((a, b) => a.sortIndex - b.sortIndex) // sorting

    innerChildren.forEach(child => appendId(child)) // to save current id

    return {
      innerChildren
    }
  },
  methods: {
    copy(index) {
      const cloned = clone(this.innerChildren[index])
      cloned.id = null
      appendId(cloned)
      this.innerChildren.splice(index + 1, 0, cloned)
    },
    remove(index) {
      this.innerChildren.splice(index, 1)
    }
  }
}
