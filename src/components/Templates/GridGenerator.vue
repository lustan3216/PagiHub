<template>
  <grid-layout
    :style="innerStyles"
    :layout="innerChildrenWithI"
    :row-height="30"
    :col-num="36"
    :margin="[5, 5]"
    :responsive="false"
    :is-draggable="isEditable"
    :is-resizable="isEditable"
    @layout-updated="innerChildren = $event"
  >
    <grid-item
      v-for="(child, index) in innerChildrenWithI"
      :x="child.x"
      :y="child.y"
      :w="child.w"
      :h="child.h"
      :i="child.id"
      :ref="child.id"
      :key="child.id"
      drag-ignore-from="a, button, form, input, p, h1, h2, h3, h4, h5, h6, svg, span, img"
      @click.stop.native="emitOpenEditBar(child.id)"
    >
      <edit-bar
        :children.sync="innerChildren"
        :index="index"
        new-function />

      <edit-area
        v-if="isEditable"
        :parent-id="child.id"
        :children="child.children"
        @update:children="updateGrandChildren(index, $event)"
      />
    </grid-item>
  </grid-layout>
</template>

<script>
import clone from 'clone'
import { emitOpenEditBar } from '../../buses/editBar'
import { onVisibleChange } from '../../buses/visibility'
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
  computed: {
    innerChildrenWithI() {
      return this.innerChildren.map(child => {
        child.i = child.id // if layoutItem doesn't have i, it will crash
        return child
      })
    }
  },
  watch: {
    innerChildren() {
      this.onVisibleChange()
    }
  },
  mounted() {
    this.onVisibleChange()
  },
  methods: {
    emitOpenEditBar,
    onVisibleChange() {
      this.innerChildren.forEach(child => {
        const node = this.$refs[child.id] && this.$refs[child.id][0]
        node && onVisibleChange(child.id, ({ visible }) => {
          node.$el.style.visibility = visible ? 'visible' : 'hidden'
        })
      })
    },
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
