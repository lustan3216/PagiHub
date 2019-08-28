<template>
  <draggable
    :value="children"
    handle=".wrapper-handler"
    class="edit-area"
    group="editableArea"
    @input="$emit('update:children', $event)"
  >
    <wrapper
      v-for="child in children"
      :tag="child.tag"
      :key="child.key"
      :children="child.children"
    />
  </draggable>
</template>

<script>
import Wrapper from '../Wrapper'

export default {
  name: 'EditArea',
  components: {
    Wrapper
  },
  props: {
    children: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.edit-area {
  height: 100%;
}
</style>
