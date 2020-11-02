<template>
  <vue-grid-item
    v-if="!hidden"
    ref="gridItem"
    :id="id"
    :i="computedLayout.i"
    :x="computedLayout.x"
    :y="computedLayout.y"
    :w="computedLayout.w"
    :h="computedLayout.h"
    :unit-h="computedLayout.unitH"
    :unit-w="computedLayout.unitW"
    :static="lock"
    :stack="stack"
    :hidden="computedLayout.hidden"
    :ratio-h="styleLayout.ratioH"
    :ratio-w="styleLayout.ratioW"
    :z-index="styleLayout.zIndex"
    :is-resizable="computedLayout.isResizable"
    :is-draggable="isDraggable"
    :fixed="computedLayout.fixed"
    :fix-on-parent-bottom="computedLayout.fixOnParentBottom"
    :vertical-compact="computedLayout.verticalCompact"
    :class="{ 'no-action': lock }"
    :auto-height="shouldAutoHeight"
    :selected="selected"
    drag-ignore-from=".item-editing"
    drag-allow-from="div"
    data-node
    @move="itemChanging"
    @resize="itemChanging"
  >
    <div
      ref="content"
      :style="{
        ...divStyle,
        ...innerStyles.html
      }"
      :class="{
        'h-100': !shouldAutoHeight
      }"
    >
      <controller-layer
        v-if="isDraftMode"
        :id="id"
      >
        <slot />
      </controller-layer>
      <slot v-else />
    </div>
  </vue-grid-item>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'
import toolMixin from './mixins/tool'
import propsMixin from './mixins/props'
import childrenMixin from './mixins/children'
import ControllerLayer from '../TemplateUtils/ControllerLayer'
import ComponentController from '../TemplateUtils/ComponentController'
import GridItem from '@/vendor/vue-grid-layout/components/GridItem'
import { getValueByPath, resizeListener } from '@/utils/tool'
import { STYLES } from '@/const'
import { closestValidBreakpoint, isGroup, isTextEditor } from '@/utils/node'
import { findBreakpoint } from '@/utils/layout'

export default {
  name: 'GridGeneratorItem',
  components: {
    ControllerLayer,
    ComponentController,
    VueGridItem: GridItem
  },
  mixins: [toolMixin, propsMixin, childrenMixin],
  inject: {
    // connect with GridGeneratorInner
    layouts: { required: true }
  },
  props: {
    divStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      exampleBoundary: 'xs',
      offResizeListener: null,
      layout: {}
    }
  },
  computed: {
    ...mapState('app', [
      'beingAddedComponentId',
      'isAdding',
      'selectedComponentIds'
    ]),
    ...mapGetters('layout', [
      'currentBreakpoint',
      'breakpointsMap',
      'descBreakpoints',
      'vh'
    ]),
    selected() {
      return this.selectedComponentIds.includes(this.id)
    },
    innerGrid() {
      return this.node.grid
    },
    validBreakpoint() {
      return this.isExample ? this.exampleBoundary : this.currentBreakpoint
    },
    currentGrid() {
      return this[this.validBreakpoint]
    },
    xl() {
      return (
        (Number.isInteger(this.breakpointsMap.xl) && this.innerGrid.xl) ||
        this.lg
      )
    },
    lg() {
      return (
        (Number.isInteger(this.breakpointsMap.lg) && this.innerGrid.lg) ||
        this.md
      )
    },
    md() {
      return (
        (Number.isInteger(this.breakpointsMap.md) && this.innerGrid.md) ||
        this.sm
      )
    },
    sm() {
      return (
        (Number.isInteger(this.breakpointsMap.md) && this.innerGrid.sm) ||
        this.xs
      )
    },
    xs() {
      return (
        (Number.isInteger(this.breakpointsMap.xs) && this.innerGrid.xs) ||
        this.xxs
      )
    },
    xxs() {
      return (
        (Number.isInteger(this.breakpointsMap.xxs) && this.innerGrid.xxs) ||
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
      const { position } = this.styleLayout
      const { userCanResize } = this.innerProps

      return {
        // might be string from selectUnit, so parse it
        x: parseInt(this.currentGrid.x) || 0,
        y: parseInt(this.currentGrid.y) || 0,
        w: parseInt(this.currentGrid.w) || 0,
        h: parseInt(this.currentGrid.h) || 0,

        unitH: this.currentGrid.unitH,
        unitW: this.currentGrid.unitW,

        stack: this.stack,
        hidden: this.hidden,

        isResizable: this.isDraftMode || userCanResize,
        isDraggable: this.isDraggable,

        fixed: position === 'fixed',
        fixOnParentBottom: position === 'fixOnParentBottom',
        verticalCompact: position === 'verticalCompact',

        id: this.id,
        i: this.id // should not happen, but just prevent crash in case
      }
    },
    isDraggable() {
      const { position } = this.styleLayout
      const { userCanDrag } = this.innerProps
      return (
        (!this.isAdding &&
          this.isDraftMode &&
          position !== 'fixOnParentBottom') ||
        (this.isProductionMode && userCanDrag)
      )
    },
    stack() {
      return this.styleLayout.stack
    },
    isTextEditor() {
      return isTextEditor(this.node)
    },
    isGroup() {
      return isGroup(this.node)
    },
    shouldAutoHeight() {
      return this.isTextEditor || this.isGroup
    }
  },
  watch: {
    shouldAutoHeight: {
      handler(value) {
        this.$nextTick(() => {
          if (value) {
            this.$refs.gridItem.autoSize()
            this.offResizeListener = resizeListener(this.$refs.content, () =>
              requestAnimationFrame(this.$refs.gridItem.autoSize)
            )
          }
          else if (this.offResizeListener) {
            this.offResizeListener()
            this.offResizeListener = null
          }
        })
      },
      immediate: true
    },
    computedLayout: {
      handler(value) {
        // 一定要轉成data，不然第一次computed 會因為不能assign值出bug
        this.updateLayout(value)
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
  updated() {
    this.updateLayout()
  },
  created() {
    if (this.isExample) {
      this.$nextTick(() => {
        const el = this.$el.closest('.art-board')
        const currentPoint = findBreakpoint(this.breakpointsMap, el.clientWidth)
        this.exampleBoundary = closestValidBreakpoint(this.node, currentPoint)
      })
    }
  },
  beforeDestroy() {
    this.$delete(this.layouts, this.id)
    if (this.offResizeListener) {
      this.offResizeListener()
      this.offResizeListener = null
    }
  },
  methods: {
    ...mapMutations('layout', { LAYOUT_SET: 'SET' }),
    ...mapActions('layout', ['resizeNodeQuickFn']),
    itemChanging() {
      this.LAYOUT_SET({ gridResizing: true })
    },
    updateLayout(layout = this.computedLayout) {
      this.layout = layout
      if (this.hidden) {
        this.$delete(this.layouts, this.id)
      }
      else {
        this.$set(this.layouts, this.id, this.layout)
      }
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep[data-invisible] + .vue-resizable-handle {
  display: none;
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

.selected:hover {
  &:before {
    border: 1px solid $color-active;
  }
}

.selected {
  &:before {
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    content: ' ';
    border: 1px solid $color-active;
  }
}
</style>
