<template>
  <grid-layout
    v-bind="innerProps"
    :style="innerStyle"
    :layout="layout"
    :margin="[0, 0]"
    :row-height="1"
    :col-num="288"
    :cols="{ lg: 288, md: 216, sm: 144, xs: 96, xxs: 48 }"
    :is-draggable="isDraftMode || isExample"
    :is-resizable="isDraftMode || isExample"
    :responsive="true"
    @layout-updated="update($event)"
  >
    <grid-item
      v-for="child in layout"
      v-bind="{ ...child, ...child.props }"
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
import childrenMixin from './mixins/children'
import GridItemChild from '../Abstract/GridItemChild'
import ControllerLayer from '../Abstract/ControllerLayer'

export default {
  name: 'GridGenerator',
  components: {
    ControllerLayer,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    GridItemChild
  },
  mixins: [childrenMixin],
  inject: {
    isExample: { default: false }
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    innerProps: {
      type: Object,
      default: () => ({})
    },
    innerStyle: {
      type: Object,
      default: () => ({})
    }
  },
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
      if (this.isExample) return
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
/* grid layout has performance issue when using border and border-radius */
.editable {
  & > div > .vue-grid-layout {
    border: none;
  }
}

::v-deep.editable .vue-resizable-handle {
  z-index: 10;
}
</style>
