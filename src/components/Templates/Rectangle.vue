<template>
  <grid-generator-item
    :id="id"
    data-image-droppable
  />
</template>

<script>
import GridGeneratorItem from './GridGeneratorItem'

export default {
  name: 'Rectangle',
  components: {
    GridGeneratorItem
  },
  props: {
    id: {
      type: String,
      required: true
    }
  }
}
</script>
