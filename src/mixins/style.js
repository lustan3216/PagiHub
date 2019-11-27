import { vmMap } from '../utils/vmMap'

export default {
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  methods: {
    vm() {
      return vmMap[this.id]
    },
    getStyles() {
      return window.getComputedStyle(this.vm().$el)
    },
    assignStyles(styles) {
      this.vm().assignStyles(styles)
    }
  }
}
