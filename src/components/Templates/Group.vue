<template>
  <grid-generator-item
    :id="id"
    data-image-droppable
    auto-resize-height
  >
    <grid-generator-inner
      :id="id"
      :is-droppable="false"
      data-image-droppable
    />
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
