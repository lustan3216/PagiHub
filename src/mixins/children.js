import clone from 'clone'
import { appendId } from '../utils/keyId'

export default {
  props: {
    children: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    innerChildren(value) {}
  },
  data() {
    const innerChildren = clone(this.children)
    innerChildren.forEach(child => appendId(child)) // to save current id

    return {
      innerChildren
    }
  },
  methods: {
    copy(index) {
      const cloned = clone(this.innerChildren[index])
      cloned.i = null
      appendId(cloned)
      this.innerChildren.splice(index + 1, 0, cloned)
    },
    remove(index) {
      this.innerChildren.splice(index, 1)
    }
  }
}
