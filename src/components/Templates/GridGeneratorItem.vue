<template>
  <vue-grid-item
    v-if="!hidden"
    ref="gridItem"
    v-bind="layout"
    :class="{
      'no-action': lock
    }"
    :auto-height="isChildTextEditor"
    drag-allow-from="div"
    @moveStart="assignStore"
    @move="itemUpdating"
    @moved="cleanStore"
    @resizeStart="assignStore"
    @resize="itemUpdating"
    @resized="cleanStore"
  >
    <div
      :class="{
        'grid-item-border': isDraftMode,
        'border-pulse': pulsing,
        'h-100': !isChildTextEditor,
        stack: pulsing && stack
      }"
      :style="innerStyles.html"
    >
      <component-giver
        v-if="child"
        ref="child"
        :id="child.id"
      />
    </div>
  </vue-grid-item>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Vue from 'vue'
import childrenMixin from './mixins/children'
import nodeMixin from './mixins/node'
import ControllerLayer from '../TemplateUtils/ControllerLayer'
import ComponentController from '../TemplateUtils/ComponentController'
import GridItem from '@/vendor/vue-grid-layout/components/GridItem'
import { getValueByPath } from '@/utils/tool'
import { STYLES } from '@/const'
import { closestGridItem, isGridItem, isTextEditor } from '@/utils/node'
import { findBreakpoint } from '@/utils/layout'

const store = Vue.observable({ updatingItemParentId: null })

export default {
  name: 'GridGeneratorItem',
  components: {
    ControllerLayer,
    ComponentController,
    VueGridItem: GridItem,
    ComponentGiver: () => import('../TemplateUtils/ComponentGiver')
  },
  mixins: [childrenMixin, nodeMixin],
  inject: {
    // connect with GridGeneratorInner
    layouts: { required: true }
  },
  data() {
    return {
      exampleBoundary: 'xs',
      layout: {}
    }
  },
  computed: {
    ...mapGetters('layout', [
      'currentBreakpoint',
      'breakpointsMap',
      'descBreakpoints',
      'vh'
    ]),
    marginTop() {
      const style = this.innerStyles.html || {}
      const borderTop = parseInt(style.border || style.borderTop || '')
      const px = this.isDraftMode && !borderTop ? 1 : borderTop
      return -(px - 1) + 'px'
    },
    innerGrid() {
      return this.node.grid
    },
    validBreakpoint() {
      return this.isExample ? this.exampleBoundary : this.currentBreakpoint
    },
    pulsing() {
      return this.id === store.updatingItemParentId
    },
    noHeight() {
      return this.isChildTextEditor && isGridItem(this.node)
    },
    currentGrid() {
      return this[this.validBreakpoint]
    },
    xl() {
      return (this.breakpointsMap.xl && this.innerGrid.xl) || this.lg
    },
    lg() {
      return (this.breakpointsMap.lg && this.innerGrid.lg) || this.md
    },
    md() {
      return (this.breakpointsMap.md && this.innerGrid.md) || this.sm
    },
    sm() {
      return (this.breakpointsMap.md && this.innerGrid.sm) || this.xs
    },
    xs() {
      return (this.breakpointsMap.xs && this.innerGrid.xs) || this.xxs
    },
    xxs() {
      return (
        (this.breakpointsMap.xxs && this.innerGrid.xxs) ||
        this.innerGrid.xs ||
        this.innerGrid.sm ||
        this.innerGrid.md ||
        this.innerGrid.lg ||
        this.innerGrid.xl
      )
    },
    lock() {
      return this.node.lock
    },
    styleLayout() {
      return getValueByPath(this.node, [STYLES, 'layout'], {})
    },
    hidden() {
      return getValueByPath(this.node, [STYLES, this.validBreakpoint, 'hidden'])
    },
    computedLayout() {
      const { ratioH, ratioW, zIndex, position } = this.styleLayout
      const { userCanResize, userCanDrag } = this.innerProps

      let h = parseInt(this.currentGrid.h)

      if (this.currentGrid.unitH === 'vh') {
        h = this.vh * h
      }

      return {
        x: this.currentGrid.x || 0,
        y: this.currentGrid.y || 0,
        w: this.currentGrid.w || 0,
        h: h || 0,

        unitH: this.currentGrid.unitH,
        unitW: this.currentGrid.unitW,

        static: this.lock,
        stack: this.stack,
        hidden: this.hidden,

        ratioH: ratioH,
        ratioW: ratioW,

        zIndex: zIndex,

        isResizable: this.isDraftMode || userCanResize,
        isDraggable:
          (this.isDraftMode && position !== 'fixOnParentBottom') || userCanDrag,
        fixed: position === 'fixed',
        fixOnParentBottom: position === 'fixOnParentBottom',
        verticalCompact: position === 'verticalCompact',

        id: this.id,
        i: this.id // should not happen, but just prevent crash in case
      }
    },
    child() {
      return this.innerChildren[0]
    },
    stack() {
      return this.styleLayout.stack
    },
    isChildTextEditor() {
      return isTextEditor(this.child)
    }
  },
  watch: {
    computedLayout: {
      handler(value) {
        // 一定要轉成data，不然第一次computed 會因為不能assign值出bug
        this.layout = value
        if (this.hidden) {
          this.$delete(this.layouts, this.id)
        }
        else {
          this.$set(this.layouts, this.id, this.layout)
        }
      },
      immediate: true
    },
    hidden(value) {
      if (value) {
        this.$delete(this.layouts, this.id)
      }
      else {
        this.$set(this.layouts, this.id, this.layout)
      }
    }
  },
  created() {
    if (this.isExample) {
      this.$nextTick(() => {
        const el = this.$el.closest('.art-board')
        const currentPoint = findBreakpoint(this.breakpointsMap, el.clientWidth)
        this.exampleBoundary = this.closestValidGrid(currentPoint)
      })
    }
  },
  beforeDestroy() {
    this.$delete(this.layouts, this.id)
  },
  methods: {
    ...mapMutations('layout', { LAYOUT_SET: 'SET' }),
    ...mapActions('layout', ['resizeNodeQuickFn']),
    closestValidGrid(currentPoint) {
      // [1,2,3,4,5]
      // currentPoint = 4
      // => [4,3,2,1,5]
      const asc = this.descBreakpoints.reverse()
      const index = asc.indexOf(currentPoint)
      const newArray = asc
        .slice(0, index + 1)
        .reverse()
        .concat(asc.slice(index + 1))

      for (let i = 0; i <= newArray.length; i++) {
        const point = newArray[i]
        if (this.innerGrid[point]) {
          return point
        }
      }
    },
    itemUpdating() {
      this.LAYOUT_SET({ gridResizing: true })
    },
    assignStore() {
      const item = closestGridItem(this.node.parentNode)
      if (item) {
        store.updatingItemParentId = item.id
      }
    },
    cleanStore() {
      this.resizeNodeQuickFn()
      store.updatingItemParentId = null
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep[data-invisible] + .vue-resizable-handle {
  display: none;
}

.grid-item-border {
  border: 1px dashed #bcbcbc;
  box-sizing: border-box;
}

.stack {
  border-color: #6c717c;
}
.border-pulse {
  animation: border-pulse 1s infinite;
}

@keyframes border-pulse {
  0% {
    border-color: #005aad;
  }
  40% {
    border-color: rgb(0, 154, 255);
  }
  100% {
    border-color: #0065ae;
  }
}
</style>
