export default {
  computed: {
    isEditable() {
      return this.$parent.$vnode.tag.includes('Wrapper')
    }
  }
}
