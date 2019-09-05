import clone from 'clone'

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
    innerChildren(value) {

    }
  },
  data() {
    return {
      innerChildren: clone(this.children)
    }
  }
}
