<template>
  <grid-layout
    :layout="innerChildrenWithI"
    :row-height="30"
    :margin="[10, 10]"
    :responsive="false"
    :is-draggable="editable"
    :is-resizable="editable"
    @layout-updated="layoutUpdatedEvent"
  >
    <grid-item
      v-for="(child, index) in innerChildrenWithI"
      :x="child.x"
      :y="child.y"
      :w="child.w"
      :h="child.h"
      :i="child.id"
      :key="child.id"
      drag-ignore-from="a, button, form, input, p, span, h1, h2, h3, h4, h5, h6, svg"
      @mouseover.native="currentHover = child.id"
      @mouseleave.native="currentHover = null"
    >
      <edit-bar
        :visible="editable && currentHover === child.id"
        @copy="copy(index)"
        @remove="remove(index)" />

      <edit-area :parent-id="id" :children.sync="child.children" />
    </grid-item>
  </grid-layout>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import childrenMixin from '../../mixins/children'
import EditBar from '../Components/EditBar'
import EditArea from '../Components/EditArea'

export default {
  name: 'GridGenerator',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    EditBar,
    EditArea
  },
  mixins: [childrenMixin],
  props: {
    editable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentHover: null
    }
  },
  computed: {
    innerChildrenWithI() {
      return this.innerChildren.map(child => {
        child.i = child.id // if layoutItem doesn't have i, it will crash
        return child
      })
    }
  },
  methods: {
    layoutUpdatedEvent(value) {
      this.innerChildren = value
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep.vue-grid-item {
  position: relative;
  /*border: 1px dashed gray;*/
}
::v-deep.edit-area {
  height: 100%;
  border: 1px dashed gray;
}
</style>
