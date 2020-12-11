<template>
  <grid-generator-item
    :id="id"
    data-image-droppable
  >
    <grid-generator-inner
      :id="id"
      :is-droppable="false"
      auto-resize
      data-image-droppable
    />
  </grid-generator-item>
</template>

<script>
import GridGeneratorItem from './GridGeneratorItem'
import GridGeneratorInner from './GridGeneratorInner'

export default {
  name: 'Section',
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
