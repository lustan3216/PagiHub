import { onVisibleChange } from '../buses/visibility'

export default {
  watch: {
    innerChildren() {
      this.onVisibleChange()
    }
  },
  mounted() {
    this.onVisibleChange()
  },
  methods: {
    onVisibleChange() {
      this.innerChildren.forEach(child => {
        if (this.$refs[child.id]) {
          onVisibleChange(child.id, this.$refs[child.id][0].$el)
        }
      })
    },
  }
}
