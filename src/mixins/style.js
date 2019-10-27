import { getVm } from '../utils/vmMap'

export default {
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  methods: {
    vm() {
      return getVm(this.id)
    },
    getStyles() {
      return window.getComputedStyle(this.vm().$el)
    },
    assignStyles(styles) {
      this.vm().assignStyles(styles)
    }
  }
}
