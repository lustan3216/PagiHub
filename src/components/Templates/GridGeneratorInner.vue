<template>
  <vue-grid-generator
    ref="gridGenerator"
    v-bind="innerProps"
    :layout="layouts"
    :responsive-layouts="responsiveLayouts"
    :margin="[0, 0]"
    :row-height="1"
    :cols="cols"
    :breakpoints="breakpointsMap"
    :vertical-compact="false"
    :is-draggable="isDraftMode && !isInstanceChild"
    :is-resizable="isDraftMode && !isInstanceChild"
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
import childrenMixin from '@/components/Templates/mixins/children'
import { toPrecision } from '@/utils/number'
import { getBreakpoint, sortAscBreakpoint } from '@/utils/layout'
import { getValueByPath } from '@/utils/tool'
import { isInstanceChild } from '@/utils/inheritance'
import { COLUMNS } from '@/const'
import { isComponentSet } from '@/utils/node'
import { vmGet } from '@/utils/vmMap'

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
    innerProps: {
      type: Object,
      default: () => ({})
    },
    innerStyles: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      responsiveLayouts: [],
      gridItemsData: {},
      exampleBoundary: 'xs'
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    ...mapState('layout', ['artBoardWidth', 'artBoardHeight']),
    ...mapState('node', ['nodesMap']),
    ...mapGetters('layout', [
      'currentBreakpoint',
      'breakpoints',
      'breakpointsMap',
      'vh'
    ]),
    rootLayout() {
      return isComponentSet(this.node.parentNode)
    },
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
    isInstanceChild() {
      return isInstanceChild(this.node)
    },
    layouts() {
      return this.responsiveLayouts[this.currentBreakPoint]
    },
    computedLayouts() {
      const layouts = {}
      let prevLayout

      sortAscBreakpoint(this.breakpoints).forEach(breakpoint => {
        const layout = []
        this.children.forEach(({ id, lock }, index) => {
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

          if (!this.gridItemsData[id]) {
            return layout.push(data)
          }

          const { styles = {}, grid, autoHeight } = this.gridItemsData[id]

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

          if (grid && currentGrid) {
            w = currentGrid.w
            h = currentGrid.h

            if (!autoHeight) {
              if (currentGrid.unitH === 'vh') {
                h = (this.vh / 100) * parseInt(h)
              }
              else {
                h = parseInt(h)
              }
            }
          }

          const styleLayout = getValueByPath(styles, ['layout'], {})
          const overflow = getValueByPath(this, 'innerStyles.html.overflow')

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
            lockInParent:
              !this.rootLayout && !['scroll', 'hidden'].includes(overflow),
            autoHeight,
            canScroll: overflow === 'scroll',
            fixed: styleLayout.position === 'fixed',
            fixedBottom: styleLayout.position === 'fixedBottom',
            verticalCompact: styleLayout.position === 'verticalCompact',
            isDraggable: styleLayout.position !== 'fixedBottom',
            stack: styleLayout.stack,
            isPixel: currentGrid.unitW === 'px'
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
      const el = this.$el.closest('.art-board')
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
          h = h / (this.vh / 100)
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
