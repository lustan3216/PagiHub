<template>
  <vue-grid-generator
    ref="gridGenerator"
    v-bind="innerProps"
    :layout="layout"
    :margin="[0, 1]"
    :is-draggable="(innerProps.isDraggable && isDraftMode) || isExample"
    :is-resizable="(innerProps.isResizable && isDraftMode) || isExample"
    @layout-updated="layoutUpdated($event)"
  >
    <vue-grid-item
      v-for="child in layout"
      :ref="child.id"
      v-bind="{ ...child, ...child.props }"
      :key="child.id"
      :style="itemPadding"
      drag-ignore-from=".noDrag"
      drag-allow-from="div"
      class="item"
    >
      <grid-item-child :id="child.id" />
    </vue-grid-item>
  </vue-grid-generator>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { AUTO_HEIGHT, PROPS } from '@/const'
import VueGridLayout from 'vue-grid-layout'
import childrenMixin from '@/components/Templates/mixins/children'
import GridItemChild from './GridItemChild'
import ControllerLayer from '../TemplateUtils/ControllerLayer'
import { getValueByPath } from '@/utils/tool'
import { debounce } from 'throttle-debounce'

const points = ['lg', 'md', 'sm', 'xs', 'xxs']

export default {
  name: 'GridGeneratorInner',
  components: {
    ControllerLayer,
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
      type: Number,
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
    ...mapState('draft', ['nodesMap']),
    ...mapGetters('draft', ['childrenOf']),
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
      if (this.innerProps.responsive || this.isExample) {
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
          this.getCurrentLayout(newChildren)
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
    currentBreakPoint() {
      this.getCurrentLayout(this.innerChildren)
    }
  },
  mounted() {
    this.width = this.$el.clientWidth
    this.$refs.gridGenerator.eventBus.$on(
      'updateWidth',
      debounce(700, width => {
        if (width) {
          this.width = this.$el.clientWidth
        }
      })
    )
  },
  methods: {
    getCurrentLayout(children) {
      this.layout = children.map((child, index) => ({
        id: child.id,
        i: child.i,
        x: this.findAncestorValue(index, 'x'),
        y: this.findAncestorValue(index, 'y'),
        w: this.findAncestorValue(index, 'w'),
        h: this.findAncestorValue(index, 'h')
      }))
    },
    findAncestorValue(childIndex, key) {
      // to avoid breakpoints data too large in the future
      // find value self first, once can't find it, here will try to find the closest value from parent
      let value
      // const points = ['lg', 'md', 'sm', 'xs', 'xxs']
      const length = points.indexOf(this.currentBreakPoint)
      for (let i = length; i >= 0; i--) {
        value = getValueByPath(this.innerChildren, [
          childIndex,
          PROPS,
          points[i],
          key
        ])
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

      this.RECORD(records)
    },
    itemAutoHeight(newChildren) {
      // 第一次加載不執行
      if (!this.layout.length) return

      newChildren.forEach(node => {
        const grandChild = this.childrenOf[node.id][0]
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
