<template>
  <vue-grid-generator
    ref="gridGenerator"
    v-bind="innerProps"
    :layout="layouts"
    :responsive-layouts="responsiveLayouts"
    :margin="[0, 0]"
    :row-height="1"
    :cols="{
      xl: 72,
      lg: 72,
      md: 72,
      sm: 72,
      xs: 72,
      xxs: 72
    }"
    :vertical-compact="false"
    :prevent-collision="false"
    :auto-height="autoHeight"
    :is-draggable="isDraftMode && !isInstanceChild"
    :is-resizable="isDraftMode && !isInstanceChild"
    responsive
    @layout-updated="layoutUpdated($event)"
  >
    <slot />
    <vue-grid-item
      v-for="child in layouts"
      v-bind="child"
      :ref="child.id"
      :key="child.id"
      drag-ignore-from=".grid-item-fix"
      drag-allow-from="div"
      @resizeStart="itemUpdating"
      @moveStart="itemUpdating"
    >
      <component-giver :id="child.id" />
    </vue-grid-item>
  </vue-grid-generator>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { COLUMNS, GRID, BREAK_POINT_KEYS } from '@/const'
import { deleteBy } from '@/utils/array'
import GridLayout from '@/vendor/vue-grid-layout/components/GridLayout'
import GridItem from '@/vendor/vue-grid-layout/components/GridItem'
import childrenMixin from '@/components/Templates/mixins/children'
import { toPrecision } from '@/utils/number'
import { getBreakpoint } from '@/utils/layout'
import { getValueByPath } from '@/utils/tool'
import { isInstanceChild } from '@/utils/inheritance'

export default {
  name: 'GridGeneratorInner',
  components: {
    VueGridGenerator: GridLayout,
    VueGridItem: GridItem,
    // 因為lopp call AsyncComponent, 這裏不用 async import 會噴bug
    ComponentGiver: () => import('../TemplateUtils/ComponentGiver')
  },
  mixins: [childrenMixin],
  provide() {
    return {
      gridItemsData: this.gridItemsData
    }
  },
  inject: {
    isExample: { default: false }
  },
  props: {
    id: {
      type: String,
      required: true
    },
    autoHeight: {
      type: Boolean,
      default: false
    },
    innerProps: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      responsiveLayouts: [],
      lockIds: [], // touchable will use it
      gridItemsData: {},
      exampleBoundary: 'xs'
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    ...mapState('layout', ['breakpoint', 'artBoardWidth', 'artBoardHeight']),
    ...mapState('node', ['nodesMap']),
    currentBreakPoint() {
      return this.isExample ? this.exampleBoundary : this.breakpoint
    },
    isInstanceChild() {
      return isInstanceChild(this.node)
    },
    layouts() {
      return this.responsiveLayouts[this.currentBreakPoint]
    },
    computedLayouts() {
      const { artBoardHeight } = this
      const layouts = {}

      BREAK_POINT_KEYS.forEach(breakPoint => {
        const layout = []
        this.children.forEach(({ id }, index) => {
          const data = {
            static: this.lockIds.includes(id),
            id: id,
            i: id || index, // should not happen, but just prevent crash in case
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            verticalCompact: false,
            autoHeight: false
          }

          if (!this.gridItemsData[id]) {
            return layout.push(data)
          }

          const { styles = {}, grid, autoHeight } = this.gridItemsData[id]

          if (!grid || !grid[breakPoint]) {
            return layout.push(data)
          }

          if (getValueByPath(styles, [breakPoint, 'hidden'])) {
            return
          }

          let w = 0
          let h = 0
          const { ratioW, ratioH, verticalCompact } = styles

          if (grid && grid[breakPoint]) {
            w = grid[breakPoint].w
            h = grid[breakPoint].h

            if (!autoHeight) {
              if (ratioH && ratioW) {
                // solve by interactjs in griditem
              }
              else if (grid[breakPoint].hUnit === 'vh') {
                h = (artBoardHeight / 100) * parseInt(h)
              }
              else {
                h = parseInt(h)
              }
            }
          }

          layout.push({
            static: this.lockIds.includes(id),
            id: id,
            i: id || index, // should not happen, but just prevent crash in case
            x: grid[breakPoint].x || 0,
            y: grid[breakPoint].y || 0,
            w,
            h,
            verticalCompact,
            autoHeight,
            ratioW,
            ratioH
          })
        })

        layouts[breakPoint] = layout
      })

      return layouts
    }
  },
  watch: {
    computedLayouts: {
      handler(value) {
        this.responsiveLayouts = value
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    if (this.isExample) {
      this.exampleBoundary = getBreakpoint(
        this.$el.closest('.example-boundary')
      )
    }
  },
  methods: {
    ...mapMutations('layout', { LAYOUT_SET: 'SET' }),
    lock(id) {
      this.lockIds.push(id)
    },
    unlock(id) {
      deleteBy(this.lockIds, id)
    },
    layoutUpdated(newChildren) {
      if (this.isExample) {
        return
      }
      // 不要在這裡更新 innerChildren, 不然undo redo會有回圈
      const records = []

      newChildren.forEach((child, index) => {
        const oldGrid = getValueByPath(this.innerChildren, [
          index,
          GRID,
          this.breakpoint
        ])
        const oldValue = {
          x: oldGrid && oldGrid.x,
          y: oldGrid && oldGrid.y,
          h: oldGrid && oldGrid.h,
          w: oldGrid && oldGrid.w
        }

        let h = child.h

        if (child.hUnit === 'vh') {
          h = h / (this.artBoardHeight / 100)
        }

        if (process.env.NODE_ENV !== 'production' && child.w === 1) {
          console.warn(`${this.id}.width === 1`)
        }

        const newValue = {
          x: child.x,
          y: child.y,
          h: toPrecision(h, 0),
          w: child.w
        }
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          records.push({
            path: `${child.id}.${GRID}.${this.currentBreakPoint}`,
            value: { ...oldValue, ...newValue }
          })
        }
      })

      if (records.length) {
        this.RECORD(records)
      }
    },
    itemUpdating() {
      this.LAYOUT_SET({ gridResizing: true })
    }
  }
}
</script>
