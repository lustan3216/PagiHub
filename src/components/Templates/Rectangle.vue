<template>
  <grid-generator-item
    :div-style="{
      background: '#E8E8E9'
    }"
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
