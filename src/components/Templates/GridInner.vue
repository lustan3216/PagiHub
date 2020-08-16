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
import { AUTO_HEIGHT, CHILDREN, PROPS } from '@/const'
import { deleteBy } from '@/utils/tool'
import VueGridLayout from 'vue-grid-layout'
import childrenMixin from '@/components/Templates/mixins/children'
import AsyncComponent from '../TemplateUtils/AsyncComponent'
import { debounce } from 'throttle-debounce'

export default {
  name: 'GridInner',
  components: {
    VueGridGenerator: VueGridLayout.GridLayout,
    VueGridItem: VueGridLayout.GridItem,
    AsyncComponent
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
    ...mapState('app', ['selectedComponentIds', 'breakpoint', 'artBoardWidth']),
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
          this.itemAutoHeight(newChildren)
          this.getCurrentLayout(newChildren)
          this.resizeNodeQuickFn()
        })
      },
      deep: true,
      immediate: true
    },
    artBoardWidth: debounce(100, function() {
      this.getCurrentLayout(this.innerChildren)
    }),
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
      let layoutW

      children.forEach((child, index) => {
        if (!child.props || (child.hidden && child.hidden[breakPoint])) {
          return
        }

        const w = child.props[breakPoint].w || 0
        let h = child.props[breakPoint].h || 0
        const { ratio } = child.props

        if (ratio && ratio.h && ratio.w) {
          layoutW = layoutW || this.$refs.gridGenerator.$el.clientWidth
          const itemWidth = (parseInt(layoutW) / 96) * w
          h = (itemWidth / ratio.w) * ratio.h
        }

        layout.push({
          static: this.lockIds.includes(child.id),
          id: child.id,
          i: child.id || index, // should not happen, but just prevent crash in case
          x: child.props[breakPoint].x || 0,
          y: child.props[breakPoint].y || 0,
          w,
          h
        })
      })

      this.layout = layout
    },
    layoutUpdated(newChildren) {
      if (this.isExample) return
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

      this.RECORD(records)
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
