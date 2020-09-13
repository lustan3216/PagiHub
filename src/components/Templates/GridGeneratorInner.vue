<template>
  <vue-grid-generator
    ref="gridGenerator"
    v-bind="innerProps"
    :layout="layouts"
    :margin="[0, 0]"
    :is-draggable="isDraftMode && !isInstanceChild"
    :is-resizable="isDraftMode && !isInstanceChild"
    @layout-updated="layoutUpdated($event)"
  >
    <vue-grid-item
      v-for="child in layouts"
      v-bind="child"
      :ref="child.id"
      :key="child.id"
      :class="{
        'z-index1': selectedComponentIds.includes(child.id)
      }"
      drag-ignore-from=".grid-item-fix"
      drag-allow-from="div"
      @resizeStart="itemUpdating"
      @resized="itemUpdated"
      @moveStart="itemUpdating"
      @moved="itemUpdated"
    >
      <component-giver :id="child.id" />
    </vue-grid-item>
  </vue-grid-generator>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { COLUMNS, GRID } from '@/const'
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
    innerProps: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      layouts: [],
      lockIds: [], // touchable will use it
      gridItemsData: {},
      exampleBoundary: 'xs'
    }
  },
  computed: {
    ...mapState('app', [
      'selectedComponentIds',
      'breakpoint',
      'artBoardWidth',
      'artBoardHeight'
    ]),
    ...mapState('node', ['nodesMap']),
    currentBreakPoint() {
      return this.isExample ? this.exampleBoundary : this.breakpoint
    },
    isInstanceChild() {
      return isInstanceChild(this.node)
    },
    computedLayouts() {
      const breakPoint = this.currentBreakPoint
      const { artBoardHeight } = this
      const layouts = []
      let layoutW

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
          return layouts.push(data)
        }

        const { styles = {}, grid, autoHeight } = this.gridItemsData[id]

        if (!grid || !grid[breakPoint]) {
          return layouts.push(data)
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
            if (grid[breakPoint].hUnit === 'vh') {
              h = (artBoardHeight / 100) * parseInt(h)
            }
            else if (ratioH && ratioW) {
              layoutW = layoutW || this.$el.clientWidth
              const itemWidth = (parseInt(layoutW) / COLUMNS) * w
              h = (itemWidth / ratioW) * ratioH
            }
            else {
              h = parseInt(h)
            }
          }
        }

        layouts.push({
          static: this.lockIds.includes(id),
          id: id,
          i: id || index, // should not happen, but just prevent crash in case
          x: grid[breakPoint].x || 0,
          y: grid[breakPoint].y || 0,
          w,
          h,
          verticalCompact,
          autoHeight
        })
      })

      return layouts
    }
  },
  watch: {
    computedLayouts: {
      handler(value) {
        this.layouts = value
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
    ...mapMutations('app', { APP_SET: 'SET' }),
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
        // if (!this.innerChildren[index] || !this.innerChildren[index][GRID]) {
        //   return
        // }
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
      // this.closestBoundaryEl.classList.add('border-pulse')
      this.APP_SET({ gridResizing: true })
    },
    itemUpdated() {
      this.APP_SET({ gridResizing: false })
    }
  }
}
</script>
