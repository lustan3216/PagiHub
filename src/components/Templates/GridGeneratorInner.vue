<template>
  <vue-grid-generator
    ref="gridGenerator"
    v-bind="innerProps"
    :layout="layout"
    :margin="[0, 0]"
    :is-draggable="isDraftMode"
    :is-resizable="isDraftMode"
    @layout-updated="layoutUpdated($event)"
  >
    <vue-grid-item
      v-for="child in layout"
      v-bind="child"
      :ref="child.id"
      :key="child.id"
      :class="{
        'z-index1': selectedComponentIds.includes(child.id)
      }"
      drag-ignore-from=".grid-item-fix"
      drag-allow-from="div"
    >
      <async-component
        :key="child.id"
        :id="child.id"
      />
    </vue-grid-item>
  </vue-grid-generator>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { AUTO_HEIGHT, CHILDREN, COLUMNS, PROPS } from '@/const'
import { deleteBy } from '@/utils/tool'
import GridLayout from '@/vendor/vue-grid-layout/components/GridLayout'
import GridItem from '@/vendor/vue-grid-layout/components/GridItem'
import childrenMixin from '@/components/Templates/mixins/children'
import { debounce } from 'throttle-debounce'
import { toPrecision } from '@/utils/number'

export default {
  name: 'GridGeneratorInner',
  components: {
    VueGridGenerator: GridLayout,
    VueGridItem: GridItem,
    // 因為lopp call AsyncComponent, 這裏不用 async import 會噴bug
    AsyncComponent: () => import('../TemplateUtils/AsyncComponent')
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
    ...mapState('app', [
      'selectedComponentIds',
      'breakpoint',
      'artBoardWidth',
      'artBoardHeight'
    ]),
    ...mapState('component', ['componentsMap']),
    currentBreakPoint() {
      return this.isExample ? 'lg' : this.breakpoint
    },
    innerChildren() {
      // 拿掉 style, props, 不然因為watch deep, 每次都會有多餘的更新
      // style 這裡完全不需要，因為gridItem component處理掉了
      return this.children.map(({ [CHILDREN]: _, style, ...node }) => node)
    }
  },
  watch: {
    innerChildren: {
      handler(newChildren) {
        this.$nextTick(() => {
          // this.getCurrentLayout 會因為拿不到refs噴bug
          this.getCurrentLayout(newChildren)
          setTimeout(() => {
            this.resizeNodeQuickFn()
          }, 20)
        })
      },
      deep: true,
      immediate: true
    },
    artBoardWidth() {
      this.getCurrentLayout(this.innerChildren)
    },
    lockIds(ids) {
      this.layout.forEach(layout => {
        layout.static = ids.includes(layout.id)
      })
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
    getCurrentLayout(children, breakPoint = this.currentBreakPoint) {
      const layout = []
      const { artBoardHeight } = this
      let layoutW
      children.forEach(({ props, hidden, id }, index) => {
        if (!props || (hidden && hidden[breakPoint])) {
          return
        }

        const w = props[breakPoint].w
        let h = props[breakPoint].h
        const { ratioW, ratioH, verticalCompact } = props

        if (ratioH && ratioW) {
          layoutW = layoutW || this.$refs.gridGenerator.$el.clientWidth
          const itemWidth = (parseInt(layoutW) / COLUMNS) * w
          h = (itemWidth / ratioW) * ratioH
        }
        else if (props[breakPoint].hUnit === 'vh') {
          h = (artBoardHeight / 100) * parseInt(h)
        }
        else {
          h = parseInt(h)
        }

        layout.push({
          static: this.lockIds.includes(id),
          id: id,
          i: id || index, // should not happen, but just prevent crash in case
          x: props[breakPoint].x || 0,
          y: props[breakPoint].y || 0,
          w,
          h,
          verticalCompact
        })
      })

      this.layout = layout
    },
    layoutUpdated(newChildren) {
      if (this.isExample) {
        this.resizeNodeQuickFn()
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
    itemAutoHeight(newChildren) {
      // 第一次加載不執行, 因為理論上儲存成功時，grid item已經是auto height的高了
      if (!this.layout.length || this.isExample) {
        return
      }

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
