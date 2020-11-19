<template>
  <vue-grid-item
    v-observe-visibility="options"
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
    :unit-x="computedLayout.unitX"
    :unit-y="computedLayout.unitY"
    :static="lock"
    :style-props="gridItemStyle"
    :hidden="computedLayout.hidden"
    :ratio="computedLayout.ratio"
    :z-index="styleLayout.zIndex"
    :is-resizable="computedLayout.isResizable"
    :is-draggable="isDraggable"
    :fixed="computedLayout.fixed"
    :class="{ 'no-action': lock }"
    :auto-resize-height="autoResizeHeight"
    @auto-sized="autoSizedHeight = $event"
    @moved="moved"
  >
    <div
      ref="content"
      :style="{
        ...divStyle,
        ...htmlStyle
      }"
      :class="{
        'h-100': !autoResizeHeight
      }"
      class="border-box"
    >
      <template v-if="inViewPort">
        <i
          v-shortkey.push="['alt']"
          v-if="moving"
          @shortkey="pressAltKey = !$event.keyup"
        />

        <event-controller
          v-if="needController && element"
          :id="id"
          :element="element"
          @mousedown="mousedown"
          @mouseup="moved"
        >
          <slot />
        </event-controller>

        <slot v-else />
      </template>
    </div>
  </vue-grid-item>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import toolMixin from './mixins/tool'
import propsMixin from './mixins/props'
import childrenMixin from './mixins/children'
import EventController from '../TemplateUtils/EventController'
import ComponentController from '../TemplateUtils/ComponentController'
import GridItem from '@/vendor/vue-grid-layout/components/GridItem'
import { cloneJson, getValueByPath } from '@/utils/tool'
import { STYLES } from '@/const'
import {
  cloneJsonWithoutChildren,
  closestValidBreakpoint,
  isBackground,
  traversalSelfAndChildren
} from '@/utils/node'
import { findBreakpoint } from '@/utils/layout'
import { appendIds } from '@/utils/nodeId'
import { ObserveVisibility } from 'vue-observe-visibility'

export default {
  name: 'GridGeneratorItem',
  components: {
    EventController,
    ComponentController,
    VueGridItem: GridItem
  },
  directives: {
    ObserveVisibility
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
    },
    autoResizeHeight: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inViewPort: true,
      options: {
        callback: isVisible => {
          this.inViewPort = isVisible || this.moving
        }
      },
      exampleBoundary: 'xs',
      layout: {},
      duplicateNodeRecords: [],
      pressAltKey: false,
      moving: false,
      autoSizedHeight: 0,
      element: null
    }
  },
  computed: {
    ...mapState('layout', ['currentBreakpoint', 'windowHeight']),
    ...mapState('app', [
      'beingAddedComponentId',
      'isAdding',
      'selectedComponentIds'
    ]),
    ...mapGetters('layout', [
      'breakpointsMap',
      'descBreakpoints',
      'vh'
    ]),
    pxX() {
      // 給align用
      return this.$refs.gridItem.pxX
    },
    pxY() {
      // 給align用
      return this.$refs.gridItem.pxY
    },
    pxW() {
      // 給operator 算zIndex用的
      return this.$refs.gridItem.pxW
    },
    pxH() {
      // 給operator 算zIndex用的
      return this.$refs.gridItem.pxH
    },
    needController() {
      if (this.isDraftMode) {
        return true
      }
      else {
        const { userCanDrag, userCanResize } = getValueByPath(this.node, 'props', {})
        return userCanDrag || userCanResize
      }
    },
    gridItemStyle() {
      const { padding, ...restOfStyles } = this.innerStyles.html || {}
      return { padding }
    },
    htmlStyle() {
      const { padding, ...restOfStyles } = this.innerStyles.html || {}
      return restOfStyles
    },
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
        (Number.isInteger(this.breakpointsMap.sm) && this.innerGrid.sm) ||
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
      const { position, ratio } = this.styleLayout
      const { userCanResize, userCanDrag } = this.innerProps

      return {
        // might be string from selectUnit, so parse it
        x: Number(this.currentGrid.x) || 0,
        y: Number(this.currentGrid.y) || 0,
        w: Number(this.currentGrid.w) || 0,
        // autoSizedHeight, if we do not put this.autoSizedHeight here, it will recover as soon as rerender.
        h: this.autoSizedHeight || Number(this.currentGrid.h) || 0,

        unitH: this.currentGrid.unitH,
        unitW: this.currentGrid.unitW,
        unitX: this.currentGrid.unitX,
        unitY: this.currentGrid.unitY,

        stack: this.stack,
        hidden: this.hidden,
        ratio,

        isResizable: this.isDraftMode || userCanResize,
        isDraggable: this.isDraggable || userCanDrag,

        fixed: position === 'fixed' && isBackground(this.node.parentNode),

        id: this.id,
        i: this.id // should not happen, but just prevent crash in case
      }
    },
    isDraggable() {
      const { userCanDrag } = this.innerProps
      return (
        (!this.isAdding && this.isDraftMode) ||
        (this.isProductionMode && userCanDrag)
      )
    },
    stack() {
      return this.styleLayout.stack
    }
  },
  watch: {
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
    },
    pressAltKey(value) {
      if (!this.moving || !this.isDraftMode || this.isExample) return

      if (value) {
        this.debounceRecord(this.duplicateNodeRecords)
      }
      else {
        this.duplicateNodeRecords.forEach(record => {
          this.debounceRecord({
            ...record,
            value: undefined
          })
        })
      }
    }
  },
  updated() {
    this.updateLayout()
    this.element = this.$el
  },
  mounted() {
    this.element = this.$el
    if (this.isExample) {
      const el = this.$el.closest('.art-board')
      const currentPoint = findBreakpoint(this.breakpointsMap, el.clientWidth)
      this.exampleBoundary = closestValidBreakpoint(this.node, currentPoint)
    }

    this.inViewPort = this.pxY < this.windowHeight
  },
  beforeDestroy() {
    this.$delete(this.layouts, this.id)
    if (this.offResizeListener) {
      this.offResizeListener()
      this.offResizeListener = null
    }
  },
  methods: {
    ...mapActions('node', ['debounceRecord']),
    mousedown(event) {
      this.prepareDuplicateNodeRecords()
      this.moving = true
      this.pressAltKey = event.altKey
    },
    prepareDuplicateNodeRecords() {
      const node = cloneJson(this.node)
      appendIds(node)
      if (getValueByPath(node, [STYLES, 'layout', 'stack'])) {
        delete node[STYLES].layout.stack
      }

      const records = []
      traversalSelfAndChildren(node, node => {
        records.push({
          path: node.id,
          value: cloneJsonWithoutChildren(node)
        })
      })

      this.duplicateNodeRecords = records
    },
    updateLayout(layout = this.computedLayout) {
      this.layout = layout
      if (this.hidden) {
        this.$delete(this.layouts, this.id)
      }
      else {
        this.$set(this.layouts, this.id, this.layout)
      }
    },
    moved() {
      this.moving = false
      this.$nextTick(() => {
        // here need to put in $nextTick to update data after $watch
        this.pressAltKey = false
      })
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
