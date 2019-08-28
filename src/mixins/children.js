import clone from 'clone'
import EditArea from '../components/EditArea'

export default {
  components: { EditArea },
  props: {
    editable: {
      type: Boolean,
      default: true
    },
    children: {
      type: Array,
      default() {
        console.log(value)
        return []
      }
    }
  },
  watch: {
    innerChildren(value) {
      console.log(value)
      debugger
      // this.$emit('update:children', value)
    }
  },
  data() {
    const innerChildren = clone(this.children)
    innerChildren.forEach(x => {
      if (!x.children) x.children = []
    })
    debugger
    return {
      innerChildren,
      currentHover: null
    }
  }
}
