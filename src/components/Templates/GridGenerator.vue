<template>
  <grid-layout
    v-if="hasAnyChild"
    v-bind="innerProps"
    :class="{ editable: isDraftMode }"
    :col-num="36"
    :row-height="5"
    :style="innerStyles"
    :layout="innerChildren"
    :margin="[0, 0]"
    :responsive="true"
    :use-css-transforms="false"
    @layout-updated="update($event)"
  >
    <grid-item
      v-for="child in innerChildren"
      :x="child.x"
      :y="child.y"
      :w="child.w"
      :h="child.h"
      :i="child.id"
      :key="child.id"
      drag-ignore-from=".no-drag"
      drag-allow-from="div"
    >
      <grid-item-child :id="child.id" />
    </grid-item>
  </grid-layout>
</template>

<script>
import { mapState } from 'vuex'
import VueGridLayout from 'vue-grid-layout'
import { cloneJson } from '../../utils/tool'
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
  mixins: [commonMixin, importTemplatesMixin, childrenMixin],
  data() {
    const getterName = `${this.isExample ? 'example' : 'draft'}/childrenOf`
    // 這裡沒必要排序，index 在各自component選擇性處理就可以
    // appendNestedIds(innerChildren)
    // children 因為每次更新 nodesMap，如果innerChildren用computed會所有的component都被更新
    let innerChildren = this.$store.getters[getterName][this.id]
    innerChildren = cloneJson(innerChildren)
    innerChildren.forEach(child => {
      if (!child.i) {
        throw new Error('grid-item need an i key')
      }
    })
    return {
      innerChildren
    }
  },
  computed: {
    ...mapState('draft', ['nodesMap'])
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

    & > .vue-resizable-handle {
      z-index: 10000;
    }
    & > div > .vue-grid-layout {
      border: none;
    }
  }
}
</style>
