import clone from 'clone'

export default {
  props: {
    editable: {
      type: Boolean,
      default: true
    },
    children: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    innerChildren(value) {
      this.$emit('update:children', value)
    }
  },
  data() {
    const innerChildren = clone(this.children)
    innerChildren.forEach(x => {
      if (!x.children) x.children = []
    })

    return {
      innerChildren,
      currentHover: null
    }
  }
}
