<template>
  <el-button
    :icon="touchable ? 'el-icon-thumb' : 'el-icon-circle-close'"
    type="text"
    size="mini"
    @click.stop="click"
  />
</template>

<script>
import { vm as _vm } from '../../../utils/vmMap'

export default {
  name: 'Visible',
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    const element = this.theElement()

    return {
      element,
      touchable: !element.classList.contains('no-action')
    }
  },
  watch: {
    touchable(value) {
      this.element.classList[value ? 'remove' : 'add']('no-action')
    }
  },
  methods: {
    theElement() {
      const vm = _vm(this.id)
      return vm.$el.closest('.vue-grid-item') || vm.$el
    },
    click() {
      this.touchable = !this.touchable
    }
  }
}
</script>
