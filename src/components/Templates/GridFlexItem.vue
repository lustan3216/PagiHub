<template>
  <grid-item
    :x="child.x"
    :y="child.y"
    :w="child.w"
    :h="child.h"
    :i="child.id"
    :key="child.id"
    drag-ignore-from="a, button, form, input, p, h1, h2, h3, h4, h5, h6, svg, span, img"
    @click.stop.native="emitOpenEditBar(child.id)"
  >
    <slot />
  </grid-item>
</template>

<script>
import clone from 'clone'
import { mapMutations } from 'vuex'
import { emitOpenEditBar } from '../../buses/editBar'
import VueGridLayout from 'vue-grid-layout'
import childrenMixin from '../../mixins/children'
import commonMixin from '../../mixins/common'
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
  mixins: [childrenMixin, commonMixin],
  props: {
    isEditable: {
      type: Boolean,
      default: true
    }
  },
  rules: {
    asd: 1
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
    ...mapMutations('nodes', ['APPEND_NODE']),
    emitOpenEditBar,
    updateGrandChildren(index, value) {
      // https://vuejs.org/v2/api/#vm-watch ，這裡一定都要clone不然watch裡面新舊值會一樣
      const cloned = clone(this.innerChildren)
      cloned[index].children = value
      this.innerChildren = cloned
    }
  }
}
</script>

<style lang="scss" scoped>
.vue-grid-layout {
  border: 1px dashed #dedede;
  border-radius: 3px;
}

::v-deep.vue-grid-item {
  position: relative;
  border: 1px dashed #dedede;
  border-radius: 3px;
  & > .vue-resizable-handle {
    z-index: 10000;
  }
}
.rise {
  z-index: 100;
}
</style>
