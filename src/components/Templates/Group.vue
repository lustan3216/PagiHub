<template>
  <grid-generator-item data-image-droppable :id="id" auto-resize-height>
    <grid-generator-inner data-image-droppable :id="id" />
  </grid-generator-item>
</template>

<script>
import GridGeneratorItem from './GridGeneratorItem'
import GridGeneratorInner from './GridGeneratorInner'

export default {
  name: 'Group',
  components: {
    GridGeneratorItem,
    GridGeneratorInner
  },
  props: {
    id: {
      type: String,
      required: true
    }
  }
}
</script>
