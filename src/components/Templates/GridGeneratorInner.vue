<template>
  <grid-layout
    v-bind="innerProps"
    :style="innerStyle"
    :layout="layout"
    :margin="[0, 0]"
    :row-height="1"
    :col-num="288"
    :cols="{ lg: 288, md: 216, sm: 144, xs: 96, xxs: 48 }"
    :is-draggable="isDraftMode || isExample"
    :is-resizable="isDraftMode || isExample"
    :responsive="true"
    @layout-updated="update($event)"
  >
    <grid-item
      v-for="child in layout"
      :ref="child.id"
      v-bind="{ ...child, ...child.props }"
      :key="child.id"
      drag-ignore-from=".noDrag"
      drag-allow-from="div"
    >
      <grid-item-child :id="child.id" />
    </grid-item>
  </grid-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import VueGridLayout from 'vue-grid-layout'
import { AUTO_SIZE } from '@/const'
import childrenMixin from '@/components/Templates/mixins/children'
import GridItemChild from './GridItemChild'
import ControllerLayer from '../TemplateUtils/ControllerLayer'
import { vm } from '@/utils/vmMap'

export default {
  name: 'GridGenerator',
  components: {
    ControllerLayer,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    GridItemChild
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
      layout: []
    }
  },
  computed: {
    ...mapState('draft', ['nodesMap']),
    ...mapGetters('draft', ['childrenOf'])
  },
  watch: {
    innerChildren: {
      handler(newChildren) {
        this.itemAutoSize(newChildren)
        this.layout = newChildren
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    update(newChildren) {
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
    itemAutoSize(newChildren) {
      // 第一次加在不執行
      if (!this.layout.length) return

      newChildren.forEach(node => {
        const grandChild = this.childrenOf[node.id][0]
        // 檢查曾祖孫有沒有autosize
        if (!grandChild || !grandChild[AUTO_SIZE]) return

        this.$nextTick(() => {
          const child = this.$refs[node.id][0]
          // 新增組建的時候，有可能組建還沒渲染就autosize，會造成零空間
          if (!vm(grandChild.id)) return

          child.$el.classList.add('disable-h-100')
          child.autoSize()
          child.$el.classList.remove('disable-h-100')
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/* grid layout has performance issue when using border and border-radius */
.editable {
  & > div > .vue-grid-layout {
    border: none;
  }
}

::v-deep.editable .vue-resizable-handle {
  z-index: 10;
}
</style>
