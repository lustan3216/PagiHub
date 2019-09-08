<template>
  <grid-layout
    :layout="layout"
    :row-height="30"
    :margin="[0, 0]"
    :responsive="false"
    :use-css-transforms="false"
    @layout-updated="updated"
  >
    <grid-item
      :x="0"
      :y="0"
      :w="w"
      :h="h"
      :i="0"
      drag-ignore-from="a, button, form, input, p, h1, h2, h3, h4, h5, h6, svg, span"
    >
      <slot />
    </grid-item>
  </grid-layout>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'

export default {
  name: 'FlexContainer',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  props: {
    w: {
      type: Number,
      default: 12
    },
    h: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      layout: [
        {
          x: 0,
          y: 0,
          w: this.w,
          h: this.h,
          i: 0
        }
      ]
    }
  },
  methods: {
    updated(value) {
      this.$emit('update:w', value[0].w)
      this.$emit('update:h', value[0].h)
    }
  }
}
</script>

<style lang="scss" scoped>
.vue-grid-layout {
  /*display: inline-block;*/
}
</style>
