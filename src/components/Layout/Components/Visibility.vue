<template>
  <i
    :class="visible ? 'el-icon-view' : 'el-icon-star-off'"
    @click.stop="click" />
</template>

<script>
import { emitVisibleChange } from '../../../buses/visibility'
export default {
  name: 'Visibility',
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      visible: true
    }
  },
  methods: {
    click() {
      this.visible = !this.visible
      emitVisibleChange(this.id, { visible: this.visible })
    }
  }
}
</script>

<style scoped lang="scss"></style>
