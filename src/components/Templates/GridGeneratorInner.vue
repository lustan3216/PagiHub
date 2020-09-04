<template>
  <vue-grid-generator
    ref="gridGenerator"
    v-bind="innerProps"
    :layout="layouts"
    :margin="[0, 0]"
    :is-draggable="isDraftMode && !isInstance"
    :is-resizable="isDraftMode && !isInstance"
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
      <component-giver
        :key="child.id"
        :id="child.id"
      />
    </vue-grid-item>
  </vue-grid-generator>
</template>

<script>
import store from '@/store'
import { mapState, mapActions, mapMutations } from 'vuex'
import { COLUMNS, GRID, CHILDREN } from '@/const'
import { deleteBy } from '@/utils/array'
import GridLayout from '@/vendor/vue-grid-layout/components/GridLayout'
import GridItem from '@/vendor/vue-grid-layout/components/GridItem'
import childrenMixin from '@/components/Templates/mixins/children'
import { toPrecision } from '@/utils/number'
import { getBreakpoint } from '@/utils/layout'
import { debounce } from 'throttle-debounce'
import { getValueByPath } from '@/utils/tool'
import { getMasterId } from '@/utils/inheritance'

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
      childrenInnerStyles: this.childrenInnerStyles
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
      childrenInnerStyles: {}
    }
  },
  computed: {
    ...mapState('app', [
      'selectedComponentIds',
      'breakpoint',
      'artBoardWidth',
      'artBoardHeight'
    ]),
    ...mapState('node', ['componentsMap']),
    currentBreakPoint() {
      return this.isExample
        ? getBreakpoint(this.$el.closest('.example-boundary'))
        : this.breakpoint
    },
    isInstance() {
      return getMasterId(this.node)
    },
    innerChildren() {
      // 這裡的style不准，統一拿gridItem裡面的innerStyle
      return this.children.map(({ [CHILDREN]: _, style, ...node }) => node)
    }
  },
  watch: {
    innerChildren: {
      handler(newChildren) {
        this.getCurrentLayout(newChildren, this.childrenInnerStyles)
      },
      deep: true,
      immediate: true
    },
    childrenInnerStyles: {
      handler(styles) {
        this.getCurrentLayout(this.innerChildren, styles)
      },
      deep: true,
      immediate: true
    },
    artBoardWidth() {
      this.getCurrentLayout(this.innerChildren, this.childrenInnerStyles)
    },
    lockIds(ids) {
      this.layouts.forEach(layout => {
        layout.static = ids.includes(layout.id)
      })
    }
  },
  methods: {
    ...mapMutations('app', { APP_SET: 'SET' }),
    ...mapActions('app', ['resizeNodeQuickFn', 'artBoardResizing']),
    lock(id) {
      this.lockIds.push(id)
    },
    unlock(id) {
      deleteBy(this.lockIds, id)
    },
    getCurrentLayout(children, childrenInnerStyles) {
      this.$nextTick(() => {
        const breakPoint = this.currentBreakPoint
        const layouts = []
        const { artBoardHeight } = this
        let layoutW

        children.forEach(({ grid, id }, index) => {
          const style = childrenInnerStyles[id] || {}
          if (getValueByPath(style, [breakPoint, 'hidden'])) {
            return
          }
          let w = 0
          let h = 0
          const { ratioW, ratioH, verticalCompact } = style
          const autoHeight =
            getValueByPath(style, 'default.overflow') === 'fitContainer'

          if (grid) {
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

        this.layouts = layouts

        this.resizeNodeQuickFn()
      })
    },
    layoutUpdated(newChildren) {
      if (this.isExample) {
        return
      }
      // 不要在這裡更新 innerChildren, 不然undo redo會有回圈
      const records = []

      newChildren.forEach((child, index) => {
        if (!this.innerChildren[index] || !this.innerChildren[index][GRID]) {
          return
        }
        const oldChild = this.innerChildren[index][GRID][this.breakpoint]
        const oldValue = {
          x: oldChild.x,
          y: oldChild.y,
          h: oldChild.h,
          w: oldChild.w
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
    itemUpdated: debounce(150, function() {
      // this.closestBoundaryEl.classList.remove('border-pulse')
      this.APP_SET({ gridResizing: false })
    })
  }
}
</script>
