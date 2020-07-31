<template>
  <vue-grid-generator
    ref="gridGenerator"
    :vertical-compact="isExample"
    v-bind="innerProps"
    :layout="layout"
    :margin="[0, 0]"
    :is-draggable="(innerProps.isDraggable && isDraftMode) || isExample"
    :is-resizable="(innerProps.isResizable && isDraftMode) || isExample"
    class="h-100"
    @layout-updated="layoutUpdated($event)"
  >
    <vue-grid-item
      v-for="child in layout"
      :ref="child.id"
      v-bind="{ ...child, ...child.props }"
      :key="child.id"
      :style="itemPadding"
      :class="{
        'z-index1': selectedComponentIds.includes(child.id)
      }"
      drag-ignore-from=".noDrag"
      drag-allow-from="div"
      class="item"
    >
      <grid-item-child :id="child.id" />
    </vue-grid-item>
  </vue-grid-generator>
</template>

<script>
import { mapState } from 'vuex'
import { AUTO_HEIGHT, PROPS } from '@/const'
import VueGridLayout from 'vue-grid-layout'
import childrenMixin from '@/components/Templates/mixins/children'
import GridItemChild from './GridItemChild'
import { getValueByPath } from '@/utils/tool'
import { debounce } from 'throttle-debounce'

const points = ['lg', 'md', 'sm', 'xs', 'xxs']

export default {
  name: 'GridGeneratorInner',
  components: {
    VueGridGenerator: VueGridLayout.GridLayout,
    VueGridItem: VueGridLayout.GridItem,
    GridItemChild
  },
  mixins: [childrenMixin],
  inject: {
    isExample: { default: false }
  },
  props: {
    id: {
      type: String,
      required: true
    },
    innerProps: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      layout: [],
      width: 0
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    ...mapState('component', ['componentsMap']),
    freeStyle() {
      return `
       ::v-deep .vue-resizable-handle {
          margin-bottom:${this.innerProps.verticalMargin}px;
          margin-right:${this.innerProps.horizontalMargin}px
      }`
    },
    itemPadding() {
      return `padding:${this.innerProps.verticalMargin}px ${this.innerProps.horizontalMargin}px`
    },
    currentBreakPoint() {
      if (!this.innerProps.responsive || this.isExample) {
        return 'lg'
      } else {
        return points.find(
          key => this.width >= this.innerProps.breakpoints[key]
        )
      }
    }
  },
  watch: {
    innerChildren: {
      handler(newChildren) {
        this.$nextTick(() => {
          this.itemAutoHeight(newChildren)
          this.getCurrentLayout(newChildren, this.currentBreakPoint)
        })
      },
      deep: true,
      immediate: true
    },
    'innerProps.breakpoints': {
      handler() {
        this.$refs.gridGenerator.responsiveGridLayout()
      },
      deep: true
    },
    'innerProps.verticalMargin'() {
      this.childrenResize()
    },
    'innerProps.horizontalMargin'() {
      this.childrenResize()
    },
    currentBreakPoint(value) {
      this.getCurrentLayout(this.innerChildren, value)
    }
  },
  mounted() {
    this.width = this.$el.clientWidth
    this.$refs.gridGenerator.eventBus.$on(
      'updateWidth',
      debounce(380, width => {
        const { clientWidth } = this.$el
        if (width && this.width !== clientWidth) {
          this.width = clientWidth
        }
      })
    )
  },
  methods: {
    getCurrentLayout(children, breakPoint) {
      const layout = children.map((child, index) => {
        return {
          id: child.id,
          i: child.id || index, // should not happen, but just prevent crash in case
          x: this.findAncestorValue(children, breakPoint, index, 'x'),
          y: this.findAncestorValue(children, breakPoint, index, 'y'),
          w: this.findAncestorValue(children, breakPoint, index, 'w'),
          h: this.findAncestorValue(children, breakPoint, index, 'h')
        }
      })

      this.layout = layout
    },
    findAncestorValue(children, currentBreakPoint, childIndex, key) {
      // to avoid breakpoints data too large in the future
      // find value self first, once can't find it, here will try to find the closest value from parent
      let value
      // const points = ['lg', 'md', 'sm', 'xs', 'xxs']
      const length = points.indexOf(currentBreakPoint)
      for (let i = length; i >= 0; i--) {
        value = getValueByPath(children, [childIndex, PROPS, points[i], key])
        if (Number.isInteger(value)) {
          break
        }
      }

      return value
    },
    childrenResize() {
      this.layout.forEach((child, index) => {
        this.layout[index].h =
          this.layout[index].h + this.innerProps.verticalMargin
      })
    },
    layoutUpdated(newChildren) {
      if (this.isExample) return
      // 不要在這裡更新 innerChildren, 不然undo redo會有回圈
      const records = []

      newChildren.forEach((child, index) => {
        const attrs = ['x', 'y', 'w', 'h']
        attrs.forEach(attr => {
          const ancestorValue = this.findAncestorValue(index, attr)

          if (ancestorValue === child[attr]) {
            return
          }

          records.push({
            path: `${child.id}.${PROPS}.${this.currentBreakPoint}.${attr}`,
            value: child[attr]
          })
        })
      })
      console.log(records)
      this.RECORD(records)
    },
    itemAutoHeight(newChildren) {
      // 第一次加載不執行
      if (!this.layout.length) return

      newChildren.forEach(node => {
        const grandChild = this.children[0]
        // 檢查自己、曾祖孫有沒有autosize
        if (grandChild && (grandChild[AUTO_HEIGHT] || node[AUTO_HEIGHT])) {
          this.$nextTick(() => {
            const child = this.$refs[node.id][0]
            // 新增組建的時候，有可能組建還沒渲染就autosize，會造成零空間
            if (!this.vmMap[grandChild.id]) return

            child.$el.classList.add('disable-h-100')
            child.autoSize()
            child.$el.classList.remove('disable-h-100')
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.item {
  box-sizing: border-box;
}
</style>
