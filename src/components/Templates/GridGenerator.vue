<template>
  <grid-layout
    v-bind="innerProps"
    :class="{ editable: isDraftMode }"
    :col-num="36"
    :row-height="5"
    :style="innerStyles"
    :layout="innerChildrenWithI"
    :margin="[0, 0]"
    :responsive="true"
    :use-css-transforms="false"
    @layout-updated="innerChildren = $event"
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
        <grid-item-child :id="child.id" />
      </grid-item>
    </template>
  </grid-layout>
</template>

<script>
import { mapState } from 'vuex'
import VueGridLayout from 'vue-grid-layout'
import { isUndefined } from '../../utils/polyfill'
import childrenMixin from '../../mixins/children'
import commonMixin from '../../mixins/common'
import importTemplatesMixin from '../../mixins/importTemplates'
import GridItemChild from './Abstract/GridItemChild'
import { defaultSetting } from '../../settings/gridGenerator'

export default {
  defaultSetting,
  name: 'GridGenerator',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    GridItemChild
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

        child.i = isUndefined(child.id) ? index : child.id
        return child
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.editable {
  border-radius: 3px;

  & > .vue-grid-item {
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
}
</style>
