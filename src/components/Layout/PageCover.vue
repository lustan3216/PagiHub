<template>
  <vue-grid-generator
    ref="gridGenerator"
    :layout="layouts"
    :responsive-layouts="responsiveLayouts"
    :margin="[0, 0]"
    :row-height="1"
    :cols="cols"
    :breakpoints="breakpointsMap"
    :vertical-compact="false"
    :auto-height="false"
    :is-draggable="isDraftMode"
    :is-resizable="isDraftMode"
    prevent-collision
    responsive
    @layout-updated="layoutUpdated($event)"
  >
    <slot />

    <vue-grid-item
      v-for="layout in layouts"
      v-bind="layout"
      :class="{ 'no-action': layout.lock }"
      :ref="layout.id"
      :key="layout.id"
      drag-ignore-from=".grid-item-fix"
      drag-allow-from="div"
      @resizeStart="itemUpdating"
      @moveStart="itemUpdating"
    >
      <component-giver :id="layout.id" />
    </vue-grid-item>
  </vue-grid-generator>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import { GRID } from '@/const'
import { findBy } from '@/utils/array'
import GridLayout from '@/vendor/vue-grid-layout/components/GridLayout'
import GridItem from '@/vendor/vue-grid-layout/components/GridItem'
import { toPrecision } from '@/utils/number'
import { getBreakpoint, sortAscBreakpoint } from '@/utils/layout'
import { getValueByPath } from '@/utils/tool'
import { COLUMNS } from '@/const'

export default {
  name: 'PageCover',
  components: {
    VueGridGenerator: GridLayout,
    VueGridItem: GridItem,
    // 因為lopp call AsyncComponent, 這裏不用 async import 會噴bug
    ComponentGiver: () => import('../TemplateUtils/ComponentGiver')
  },
  provide() {
    return {
      gridItemsData: this.gridItemsData
    }
  },
  inject: {
    isExample: { default: false }
  },
  data() {
    return {
      responsiveLayouts: [],
      exampleBoundary: 'xs'
    }
  },
  computed: {
    ...mapState('app', ['fixedComponentIds']),
    ...mapState('layout', ['artBoardHeight']),
    ...mapGetters('layout', [
      'currentBreakpoint',
      'breakpoints',
      'breakpointsMap'
    ]),
    cols() {
      const object = {}
      this.breakpoints.forEach(point => {
        object[point] = COLUMNS
      })
      return object
    },
    currentBreakPoint() {
      return this.isExample ? this.exampleBoundary : this.currentBreakpoint
    },
    layouts() {
      return this.responsiveLayouts[this.currentBreakPoint]
    },
    nodes() {
      return this.fixedComponentIds.forEach(id => this.nodesMap[id])
    },
    computedLayouts() {
      const { artBoardHeight } = this
      const layouts = {}
      let prevLayout

      sortAscBreakpoint(this.breakpoints).forEach(breakpoint => {
        const layout = []

        this.nodes.forEach(({ id, lock }, index) => {
          const data = {
            static: false,
            id: id,
            i: id || index, // should not happen, but just prevent crash in case
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            verticalCompact: false,
            autoHeight: false
          }

          const { styles = {}, grid, autoHeight } = this.gridItemsData[id]

          if (getValueByPath(styles, ['layout', 'fixWhenScrolling'])) {
            return
          }

          if (!grid) {
            return layout.push(data)
          }

          const currentGrid = grid[breakpoint]

          if (!currentGrid) {
            return layout.push(findBy(prevLayout, 'id', id))
          }

          if (getValueByPath(styles, [breakpoint, 'hidden'])) {
            return
          }

          let w = 0
          let h = 0
          const verticalCompact = getValueByPath(styles, [
            'layout',
            'verticalCompact'
          ])

          if (grid && currentGrid) {
            w = currentGrid.w
            h = currentGrid.h

            if (!autoHeight) {
              if (currentGrid.unitH === 'vh') {
                h = (artBoardHeight / 100) * parseInt(h)
              }
              else {
                h = parseInt(h)
              }
            }
          }

          layout.push({
            static: lock,
            lock,
            id: id,
            i: id || index, // should not happen, but just prevent crash in case
            x: currentGrid.x || 0,
            y: currentGrid.y || 0,
            w,
            h,
            unitH: currentGrid.unitH,
            unitW: currentGrid.unitW,
            verticalCompact,
            autoHeight,
            lockInParent: !this.rootLayout,
            ...styles.layout
          })
        })

        layouts[breakpoint] = prevLayout = layout
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
      const el =
        this.$el.closest('.art-board')
      this.exampleBoundary = getBreakpoint(el)
    }
  },
  methods: {
    ...mapMutations('layout', { LAYOUT_SET: 'SET' }),
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

        if (child.unitH === 'vh') {
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
