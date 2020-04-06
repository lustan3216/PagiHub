<template>
  <grid-layout
    v-if="hasAnyChild"
    v-bind="innerProps"
    :class="{ editable: isDraftMode }"
    :col-num="36"
    :vertical-compact="false"
    :row-height="5"
    :style="innerStyles"
    :layout="layout"
    :margin="[0, 0]"
    :responsive="true"
    @layout-updated="update($event)"
  >
    <grid-item
      v-for="child in layout"
      :x="child.x"
      :y="child.y"
      :w="child.w"
      :h="child.h"
      :i="child.id"
      :key="child.id"
      drag-ignore-from=".noDrag"
      drag-allow-from="div"
    >
      <grid-item-child :id="child.id" />
    </grid-item>
  </grid-layout>
</template>

<script>
import { mapState } from 'vuex'
import VueGridLayout from 'vue-grid-layout'
import childrenMixin from '../../mixins/children'
import nodeMixin from '../../mixins/node'
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
  mixins: [nodeMixin, importTemplatesMixin, childrenMixin],
  data() {
    return {
      layout: []
    }
  },
  computed: {
    ...mapState('draft', ['nodesMap'])
  },
  watch: {
    innerChildren: {
      handler(newValue) {
        this.layout = newValue
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    update(newChildren) {
      // 不要在這裡更新 innerChildren, 不然undo redo會有回圈
      const records = []

      newChildren.forEach(child => {
        const attrs = ['x', 'y', 'w', 'h']
        attrs.forEach(attr => {
          records.push({
            path: `${child.id}.${attr}`,
            value: child[attr]
          })
        })
      })

      this.RECORD(records)
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

    & > div > .vue-grid-layout {
      border: none;
    }
  }
}
::v-deep.editable .vue-resizable-handle {
  z-index: 10;
}
</style>
