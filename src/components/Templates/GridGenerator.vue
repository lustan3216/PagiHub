<template>
  <grid-layout
    :style="innerStyles"
    :layout="innerChildrenWithI"
    :row-height="1"
    :col-num="100"
    :margin="[0, 0]"
    :responsive="false"
    :vertical-compact="true"
    @layout-updated="layoutUpdated"
  >
    <template v-for="child in innerChildrenWithI">
      <el-popover
        v-if="isEditable"
        :value="isEditBarVisible(child.id)"
        :open-delay="100"
        :close-delay="0"
        :key="`popover${child.id}`"
        :ref="child.id"
        trigger="manual"
        placement="right"
      >
        <edit-bar :id="child.id" />
      </el-popover>

      <grid-item
        v-popover:[child.id]
        :asd="$log(child.id, child.x)"
        :x="child.x"
        :y="child.y"
        :w="child.w"
        :h="child.h"
        :i="child.id"
        :ref="child.id"
        :key="child.id"
        drag-ignore-from=".no-drag"
        drag-allow-from="div"
        @click.stop.native="openEditBarById(child.id)"
      >
        <slot v-bind="child">
          <component-add v-bind="child" />
        </slot>
      </grid-item>
    </template>
  </grid-layout>
</template>

<script>
import { onVisibleChange } from '../../buses/visibility'
import VueGridLayout from 'vue-grid-layout'
import childrenMixin from '../../mixins/children'
import commonMixin from '../../mixins/common'
import importTemplatesMixin from '../../mixins/importTemplates'
import EditBar from './Components/EditBar'
import ComponentAdd from './ComponentAdd'

export default {
  name: 'GridGenerator',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    EditBar,
    ComponentAdd
  },
  mixins: [childrenMixin, commonMixin, importTemplatesMixin],
  data() {
    return {
      visibleId: false
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
    onVisibleChange() {
      this.innerChildren.forEach(child => {
        const node = this.$refs[child.id] && this.$refs[child.id][0]
        node &&
          onVisibleChange(child.id, ({ visible }) => {
            node.$el.style.visibility = visible ? 'visible' : 'hidden'
          })
      })
    },
    layoutUpdated(layout) {
      this.innerChildren = layout
    }
  }
}
</script>

<style lang="scss" scoped>
.vue-grid-layout {
  border-radius: 3px;
}

::v-deep.vue-grid-item {
  position: relative;
  border: 1px dashed #dedede;
  border-radius: 3px;
  /*padding: 5px;*/
  /*box-sizing: border-box;*/
  & > .vue-resizable-handle {
    z-index: 10000;
  }
  & > div > .vue-grid-layout {
    border: none;
  }
}
</style>
