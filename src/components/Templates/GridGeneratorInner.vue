<template>
  <vue-grid-generator
    ref="gridGenerator"
    v-bind="innerProps"
    :layout="layout"
    :margin="[0, 0]"
    :is-draggable="isDraftMode || isExample"
    :is-resizable="isDraftMode || isExample"
    @layout-updated="layoutUpdated($event)"
  >
    <vue-grid-item
      v-for="child in layout"
      :ref="child.id"
      v-bind="child"
      :key="child.id"
      :class="{
        'z-index1': selectedComponentIds.includes(child.id)
      }"
      drag-ignore-from=".drag-fix"
      drag-allow-from="div"
    >
      <grid-item-child :id="child.id" />
    </vue-grid-item>
  </vue-grid-generator>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { AUTO_HEIGHT, PROPS } from '@/const'
import { deleteBy } from '@/utils/tool'
import VueGridLayout from 'vue-grid-layout'
import childrenMixin from '@/components/Templates/mixins/children'
import GridItemChild from './GridItemChild'

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
      lockIds: [] // touchable will use it
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds', 'breakpoint']),
    ...mapState('component', ['componentsMap']),
    // freeStyle() {
    //   return `
    //    ::v-deep .vue-resizable-handle {
    //       margin-bottom:${this.innerProps.verticalMargin}px;
    //       margin-right:${this.innerProps.horizontalMargin}px
    //   }`
    // },
    // itemPadding() {
    //   return `padding:${this.innerProps.verticalMargin}px ${this.innerProps.horizontalMargin}px`
    // },
    currentBreakPoint() {
      return this.isExample ? 'lg' : this.breakpoint
    }
  },
  watch: {
    innerChildren: {
      handler(newChildren) {
        this.$nextTick(() => {
          this.itemAutoHeight(newChildren)
          this.getCurrentLayout(newChildren, this.currentBreakPoint)
          this.resizeNodeQuickFn()
        })
      },
      deep: true,
      immediate: true
    },
    currentBreakPoint(value) {
      this.getCurrentLayout(this.innerChildren, value)
    },
    lockIds() {
      this.getCurrentLayout(this.innerChildren, this.currentBreakPoint)
    }
  },
  methods: {
    ...mapActions('app', ['resizeNodeQuickFn']),
    lock(id) {
      this.lockIds.push(id)
    },
    unlock(id) {
      deleteBy(this.lockIds, id)
    },
    getCurrentLayout(children, breakPoint) {
      const layout = []
      children.forEach((child, index) => {
        if (!child.props || child.props[breakPoint].hidden) {
          return
        }

        layout.push({
          static: this.lockIds.includes(child.id),
          id: child.id,
          i: child.id || index, // should not happen, but just prevent crash in case
          x: child.props[breakPoint].x || 0,
          y: child.props[breakPoint].y || 0,
          w: child.props[breakPoint].w || 0,
          h: child.props[breakPoint].h || 0
        })
      })

      this.layout = layout
    },
    layoutUpdated(newChildren) {
      if (this.isExample) return
      // 不要在這裡更新 innerChildren, 不然undo redo會有回圈
      const records = []

      newChildren.forEach((child, index) => {
        const oldChild = this.innerChildren[index].props[this.breakpoint]
        const oldValue = {
          x: oldChild.x,
          y: oldChild.y,
          h: oldChild.h,
          w: oldChild.w
        }

        const newValue = {
          x: child.x,
          y: child.y,
          h: child.h,
          w: child.w
        }
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          records.push({
            path: `${child.id}.${PROPS}.${this.currentBreakPoint}`,
            value: newValue
          })
        }
      })

      if (records.length) {
        this.RECORD(records)
      }
    },
    itemAutoHeight(newChildren) {
      // 第一次加載不執行, 因為理論上儲存成功時，grid item已經是auto hieght的高了
      if (!this.layout.length) return

      newChildren.forEach(node => {
        const gridItem = this.componentsMap[node.id]
        const autoHeightItem = gridItem.children[0]

        if (autoHeightItem && autoHeightItem[AUTO_HEIGHT]) {
          const child = this.$refs[node.id][0]
          this.$nextTick(() => {
            // 新增組建的時候，有可能組建還沒渲染就autosize，會造成零空間
            if (!this.vmMap[autoHeightItem.id]) return

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
