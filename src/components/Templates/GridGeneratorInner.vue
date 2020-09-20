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
import { mapState, mapMutations, mapGetters } from 'vuex'
import { GRID } from '@/const'
import { deleteBy, findBy } from '@/utils/array'
import GridLayout from '@/vendor/vue-grid-layout/components/GridLayout'
import GridItem from '@/vendor/vue-grid-layout/components/GridItem'
import childrenMixin from '@/components/Templates/mixins/children'
import { toPrecision } from '@/utils/number'
import { getBreakpoint, sortAscBreakpoint } from '@/utils/layout'
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
    ...mapState('layout', ['artBoardWidth', 'artBoardHeight']),
    ...mapState('node', ['nodesMap']),
    ...mapGetters('layout', [
      'currentBreakpoint',
      'breakpoints',
      'breakpointsMap'
    ]),

    cols() {
      const object = {}
      this.breakpoints.forEach(point => {
        object[point] = 100
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
      const { artBoardHeight } = this
      const layouts = {}
      let prevLayout

      sortAscBreakpoint(this.breakpoints).forEach(breakpoint => {
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
          const ratioW = getValueByPath(styles, ['layout', 'ratioW'])
          const ratioH = getValueByPath(styles, ['layout', 'ratioH'])
          const verticalCompact = getValueByPath(styles, [
            'layout',
            'verticalCompact'
          ])

          if (grid && currentGrid) {
            w = currentGrid.w
            h = currentGrid.h

            if (!autoHeight) {
              if (ratioH && ratioW) {
                // solve by interactjs in gridItem
              }
              else if (currentGrid.hUnit === 'vh') {
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
            x: currentGrid.x || 0,
            y: currentGrid.y || 0,
            w,
            h,
            verticalCompact,
            autoHeight,
            ratioW,
            ratioH
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
