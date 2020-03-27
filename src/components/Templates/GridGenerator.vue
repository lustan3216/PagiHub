<template>
  <grid-layout
    v-bind="innerProps"
    :col-num="24"
    :row-height="5"
    :style="innerStyles"
    :layout="innerChildrenWithI"
    :margin="[0, 0]"
    :responsive="true"
    :use-css-transforms="false"
    @layout-updated="layoutUpdated"
  >
    <template v-for="child in innerChildrenWithI">
      <grid-item
        :x="child.x"
        :y="child.y"
        :w="child.w"
        :h="child.h"
        :i="child.id"
        :ref="child.id"
        :key="child.id"
        drag-ignore-from=".no-drag"
        drag-allow-from="div"
      >
        <slot v-bind="{ child }">
          <component-add :id="child.id" :children="child.children" />
        </slot>
      </grid-item>
    </template>
  </grid-layout>
</template>

<script>
import { vmMap } from '../../utils/vmMap'
import { mapState } from 'vuex'
import VueGridLayout from 'vue-grid-layout'
import childrenMixin from '../../mixins/children'
import commonMixin from '../../mixins/common'
import importTemplatesMixin from '../../mixins/importTemplates'
import ComponentAdd from './Common/ComponentAdd'
import { defaultSetting } from '../../settings/drawer'

export default {
  defaultSetting,
  name: 'GridGenerator',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    ComponentAdd
  },
  mixins: [childrenMixin, commonMixin, importTemplatesMixin],
  computed: {
    ...mapState('nodes', ['currentNodesMap']),
    innerChildrenWithI() {
      return this.innerChildren.map((child, index) => {
        // if layoutItem doesn't have i, it will crash
        // the i assigning here will affect data innerChild which is correct here
        // otherwise somehow it will bring a bug that makes layout immutable
        // anyway, just don't modify here
        child.i = child.id || index
        return child
      })
    }
  },
  watch: {
    innerChildren(value) {
      if (!value.length) {
        const { parentId } = this.currentNodesMap[this.id]
        const vm = vmMap[parentId]
        vm.remove(this.id)
      }
    }
  },
  methods: {
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

  & > .vue-resizable-handle {
    z-index: 10000;
  }
  & > div > .vue-grid-layout {
    border: none;
  }
}
</style>
