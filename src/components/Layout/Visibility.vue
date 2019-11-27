<template>
  <i
    :class="visible ? 'el-icon-view' : 'el-icon-star-off'"
    @click.stop="click"
  />
</template>

<script>
import { vmMap } from '../../utils/vmMap'

export default {
  name: 'Visibility',
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    // 新增複製時，有可能拿不到vm
    const vm = vmMap[this.id]
    return {
      visible: vm ? !vm.$el.classList.contains('invisible') : true
    }
  },
  computed: {
    element() {
      return vmMap[this.id].$el
    }
  },
  watch: {
    visible(value) {
      this.element.classList[value ? 'remove' : 'add']('invisible')
    }
  },
  methods: {
    click() {
      this.visible = !this.visible
    }
  }
}
</script>
