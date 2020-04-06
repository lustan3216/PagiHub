<template>
  <el-button
    :icon="visible ? 'el-icon-view' : 'el-icon-circle-close'"
    type="text"
    size="mini"
    @click.stop="click"
  />
</template>

<script>
import { vm as _vm } from '../../../utils/vmMap'

export default {
  name: 'Visibility',
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
      visible: !element.classList.contains('invisible')
    }
  },
  watch: {
    visible(value) {
      this.element.classList[value ? 'remove' : 'add']('invisible')
    }
  },
  methods: {
    theElement() {
      const vm = _vm(this.id)
      return vm.$el.closest('.vue-grid-item') || vm.$el
    },
    click() {
      this.visible = !this.visible
    }
  }
}
</script>
