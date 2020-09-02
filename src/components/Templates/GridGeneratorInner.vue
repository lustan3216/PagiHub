<template>
  <vue-grid-generator
    ref="gridGenerator"
    v-bind="innerProps"
    :layout="innerLayouts"
    :margin="[0, 0]"
    :is-draggable="isDraftMode"
    :is-resizable="isDraftMode"
    @layout-updated="layoutUpdated($event)"
  >
    <vue-grid-item
      v-for="child in innerLayouts"
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
      <async-component
        :key="child.id"
        :id="child.id"
      />
    </vue-grid-item>
  </vue-grid-generator>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { CHILDREN, COLUMNS, PROPS, STYLE } from '@/const'
import { deleteBy } from '@/utils/array'
import GridLayout from '@/vendor/vue-grid-layout/components/GridLayout'
import GridItem from '@/vendor/vue-grid-layout/components/GridItem'
import childrenMixin from '@/components/Templates/mixins/children'
import { toPrecision } from '@/utils/number'
import { getBreakpoint } from '@/utils/layout'
import { debounce } from 'throttle-debounce'
import { getValueByPath } from '@/utils/tool'

export default {
  name: 'GridGeneratorInner',
  components: {
    VueGridGenerator: GridLayout,
    VueGridItem: GridItem,
    // 因為lopp call AsyncComponent, 這裏不用 async import 會噴bug
    AsyncComponent: () => import('../TemplateUtils/AsyncComponent')
  },
  mixins: [childrenMixin],
  provide() {
    return {
      layouts: this.layouts
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
      innerLayouts: []
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
    innerChildren() {
      // 拿掉 style, props, 不然因為watch deep, 每次都會有多餘的更新
      return this.children.map(({ [CHILDREN]: _, style, ...node }) => node)
    },
    closestBoundaryEl() {
      const item = this.$el.closest('.vue-grid-item')
      return item || document.getElementById('art-board')
    }
  },
  watch: {
    innerChildren: {
      handler(newChildren) {
        // style 已經統一從 gridGeneratorItem裡面送innerStyle過來了，這裏不要再處理
        // 這裡只要注意有沒有新增刪除node
        const layouts = []

        newChildren.forEach(child => {
          // 有找到就塞舊的，因為也沒變，沒找到代表新增的，剩下的就是刪除的不用塞
          const layout = this.layouts.find(x => x.id === child.id)
          layouts.push(layout || child)
        })

        this.layouts = layouts
      },
      immediate: true
    },
    layouts: {
      handler(value) {
        this.$nextTick(() => {
          // this.getCurrentLayout 會因為拿不到refs噴bug
          this.getCurrentLayout(value)
        })
      },
      deep: true,
      immediate: true
    },
    artBoardWidth() {
      this.getCurrentLayout(this.innerChildren)
    },
    lockIds(ids) {
      this.layouts.forEach(layout => {
        layout.static = ids.includes(layout.id)
      })
    }
  },
  mounted() {
    this.$refs.gridGenerator.onWindowResize()
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
    getCurrentLayout(children) {
      const breakPoint = this.currentBreakPoint
      const layouts = []
      const { artBoardHeight } = this
      let layoutW

      children.forEach(({ props, style = {}, autoHeight, id }, index) => {
        if (!props || getValueByPath(style, [breakPoint, 'hidden'])) {
          return
        }

        const w = props[breakPoint].w
        let h = props[breakPoint].h
        const { ratioW, ratioH, verticalCompact } = style

        if (!autoHeight) {
          if (props[breakPoint].hUnit === 'vh') {
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

        layouts.push({
          static: this.lockIds.includes(id),
          id: id,
          i: id || index, // should not happen, but just prevent crash in case
          x: props[breakPoint].x || 0,
          y: props[breakPoint].y || 0,
          w,
          h,
          verticalCompact,
          autoHeight
        })
      })

      this.innerLayouts = layouts
      this.$nextTick(() => {
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
        if (!this.innerChildren[index] || !this.innerChildren[index].props) {
          return
        }
        const oldChild = this.innerChildren[index].props[this.breakpoint]
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
            path: `${child.id}.${PROPS}.${this.currentBreakPoint}`,
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
