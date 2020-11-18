<template>
  <grid-generator-item
    :id="id"
    data-image-droppable
    auto-resize-height
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
  name: 'Group',
  components: {
    GridGeneratorItem,
    GridGeneratorInner
  },
  inject: {
    // gridItemAutoSize: { required: true }
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      offResizeListener: null
    }
  },
  mounted() {
    // this.gridItemAutoSize()
    // this.offResizeListener = resizeListener(this.$refs.content.$el, () => {
    //   requestAnimationFrame(() => {
    //     this.gridItemAutoSize()
    //   })
    // })
  }
}
</script>
