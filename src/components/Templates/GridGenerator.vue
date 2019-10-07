<template>
  <edit-bar :id="id">
    <grid-layout
      ref="asd"
      :style="innerStyles"
      :layout="innerChildrenWithI"
      :row-height="30"
      :col-num="36"
      :margin="[5, 5]"
      :responsive="false"
      :is-draggable="isEditable"
      :is-resizable="isEditable"
      :use-css-transforms="true"
      @layout-updated="innerChildren = $event"
    >
      <template v-for="child in innerChildrenWithI">
        <el-popover
          :key="`popover${child.id}`"
          :ref="child.id"
          trigger="hover"
          placement="right">
          <edit-bar :id="child.id" />
        </el-popover>

        <grid-item
          v-popover:[child.id]
          :x="child.x"
          :y="child.y"
          :w="child.w"
          :h="child.h"
          :i="child.id"
          :ref="child.id"
          :key="child.id"
          drag-ignore-from="a, button, form, input, p, h1, h2, h3, h4, h5, h6, svg, span, img, iframe"
        >
          <edit-area
            v-if="isEditable"
            :id="child.id" />
        </grid-item>
      </template>
    </grid-layout>
  </edit-bar>
</template>

<script>
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
        // if layoutItem doesn't have i, it will crash
        // the i assigning here will affect data innerChild which is correct here
        // otherwise somehow it will bring a bug that makes layout immutable
        // anyway, just don't modify here
        child.i = child.id
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
        node &&
          onVisibleChange(child.id, ({ visible }) => {
            node.$el.style.visibility = visible ? 'visible' : 'hidden'
          })
      })
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
  overflow: hidden;
  & > .vue-resizable-handle {
    z-index: 10000;
  }
}
.rise {
  z-index: 100;
}
</style>
