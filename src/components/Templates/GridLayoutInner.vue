<template>
  <vue-grid-layout
    ref="gridLayout"
    v-bind="innerProps"
    :style="innerStyle"
    :layout="layout"
    :row-height="1"
    :margin="[innerProps.horizontalMargin, 0]"
    :is-draggable="(innerProps.isDraggable && isDraftMode) || isExample"
    :is-resizable="(innerProps.isResizable && isDraftMode) || isExample"
    @layout-updated="layoutUpdated($event)"
  >
    <div v-style>
      .asd, .fdsewqf { {{ `padding-bottom:${innerProps.verticalMargin}px` }} }
      .dsfe, .fdsewqf { {{ `padding-bottom:${innerProps.verticalMargin}px;` }} }
    </div>

    <vue-grid-item
      v-for="child in layout"
      :ref="child.id"
      v-bind="{ ...child, ...child.props }"
      :key="child.id"
      drag-ignore-from=".noDrag"
      drag-allow-from="div"
    >
      <div
        :log="
          $Log(
            `padding:${innerProps.vertical ||
            0}px ${innerProps.horizontalMargin || 0}px`
          )
        "
        :style="`padding-bottom:${innerProps.verticalMargin}px`"
        class="h-100 item"
      >
        <grid-item-child :id="child.id" />
      </div>
    </vue-grid-item>
  </vue-grid-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import VueGridLayout from 'vue-grid-layout'
import GridItem from 'vue-grid-layout/src/components/GridItem.vue'
import { AUTO_HEIGHT } from '@/const'
import childrenMixin from '@/components/Templates/mixins/children'
import GridItemChild from './GridItemChild'
import ControllerLayer from '../TemplateUtils/ControllerLayer'
import style from '../../directive/style'

export default {
  name: 'GridLayoutInner',
  components: {
    ControllerLayer,
    VueGridLayout: VueGridLayout.GridLayout,
    VueGridItem: GridItem,
    GridItemChild
  },
  directives: {
    style
  },
  mixins: [childrenMixin],
  inject: {
    isExample: { default: false }
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    innerProps: {
      type: Object,
      default: () => ({})
    },
    innerStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      layout: [],
      heights: []
    }
  },
  computed: {
    ...mapState('draft', ['nodesMap']),
    ...mapGetters('draft', ['childrenOf'])
  },
  watch: {
    innerChildren: {
      handler(newChildren) {
        this.itemAutoHeight(newChildren)
        this.layout = newChildren
        this.layout.forEach((child, index) => {
          this.layout[index].h =
            this.layout[index].h + this.innerProps.verticalMargin
          // this.layout[index].y = Math.round(
          //   this.layout[index].y / this.innerProps.verticalMargin
          // )
        })
      },
      deep: true,
      immediate: true
    },
    'innerProps.breakpoints': {
      handler() {
        this.$refs.gridLayout.responsiveGridLayout()
      },
      deep: true
    },
    // 'innerProps.verticalMargin'() {
    //   this.childrenResize()
    // },
    'innerProps.horizontalMargin'() {
      this.childrenResize()
    }
  },
  methods: {
    childrenResize() {
      const { $children } = this.$refs.gridLayout
      this.heights = $children.map((child, index) => {
        if (this.layout[index]) {
          child.margin = [this.innerProps.horizontalMargin, 0]
          //
          // this.layout[index].h =
          //   this.layout[index].h / this.innerProps.verticalMargin
          // this.layout[index].y =
          //   this.layout[index].y / this.innerProps.verticalMargin
          child.createStyle()
        }

        // return child.$el.style.width
      })
    },
    layoutUpdated(newChildren) {
      if (this.isExample) return
      // 不要在這裡更新 innerChildren, 不然undo redo會有回圈
      const records = []

      newChildren.forEach(child => {
        const attrs = ['x', 'y', 'w', 'h']
        attrs.forEach(attr => {
          records.push({
            path: `${child.id}.${attr}`,
            value: child[attr]
          })
        })
      })

      this.RECORD(records)
    },
    itemAutoHeight(newChildren) {
      // 第一次加在不執行
      if (!this.layout.length) return

      newChildren.forEach(node => {
        const grandChild = this.childrenOf[node.id][0]
        // 檢查曾祖孫有沒有autosize
        if (!grandChild || !grandChild[AUTO_HEIGHT]) return

        this.$nextTick(() => {
          const child = this.$refs[node.id][0]
          // 新增組建的時候，有可能組建還沒渲染就autosize，會造成零空間
          if (!this.vmMap[grandChild.id]) return

          child.$el.classList.add('disable-h-100')
          child.autoSize()
          child.$el.classList.remove('disable-h-100')
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.item {
  box-sizing: border-box;
}
</style>
