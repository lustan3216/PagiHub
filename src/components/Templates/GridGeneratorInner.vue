<template>
<!--  data-addable-id 不能刪，add element要用的-->
  <vue-grid-generator
    ref="gridGenerator"
    v-bind="innerProps"
    :id="id"
    :layout="layout"
    :col-num="windowWidth"
    :vertical-compact="false"
    :is-draggable="isDraftMode"
    :is-resizable="isDraftMode"
    :auto-extend-height="autoExtendHeight"
    :extra-style="extraStyle"
    :data-addable-id="id"
    @drop="handleDrop"
    @height-updated="$emit('height-updated', $event)"
    @layout-updated="layoutUpdated($event)"
  >
    <event-controller
      v-if="controller && isDraftMode"
      :id="id"
    >
      <component-giver
        v-for="child in children"
        :key="child.id"
        :id="child.id"
      />
    </event-controller>

    <template v-else>
      <component-giver
        v-for="child in children"
        :key="child.id"
        :id="child.id"
      />
    </template>
  </vue-grid-generator>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { GRID } from '@/const'
import GridLayout from '@/vendor/vue-grid-layout/components/GridLayout'
import childrenMixin from '@/components/Templates/mixins/children'
import { getValueByPath } from '@/utils/tool'
import { isBackground, isSlider, traversalSelfAndChildren } from '@/utils/node'
import EventController from '../TemplateUtils/EventController'
import { unitConvert } from '@/utils/layout'

export default {
  name: 'GridGeneratorInner',
  components: {
    VueGridGenerator: GridLayout,
    // 因為loop call AsyncComponent, 這裏不用 async import 會噴bug
    ComponentGiver: () => import('../TemplateUtils/ComponentGiver'),
    EventController
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
    },
    innerStyles: {
      type: Object,
      default: () => ({})
    },
    controller: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      layouts: {}
    }
  },
  computed: {
    ...mapState('layout', ['windowWidth']),
    ...mapGetters('layout', ['currentBreakpoint', 'vh']),
    autoExtendHeight() {
      return !isSlider(this.node)
    },
    overflow() {
      return getValueByPath(this.node.parentNode, 'styles.html.overflow')
    },
    layout() {
      return Object.values(this.layouts)
    },
    isBackground() {
      return isBackground(this.node)
    },
    extraStyle() {
      const style = {}
      if (this.isBackground) {
        style.minHeight = '100%'
      }

      return style
    }
  },
  methods: {
    ...mapActions('node', ['debounceRecord']),
    handleDrop(event) {
      const dropNode = event.target.__vue__.node
      const dragNode = event.relatedTarget.__vue__.node

      if (!dropNode || !dragNode) return
      let inTheSameTree = false

      traversalSelfAndChildren(dropNode, node => {
        inTheSameTree = node.parentId === dragNode.id
        if (inTheSameTree) return false
      })

      if (inTheSameTree) return

      traversalSelfAndChildren(dragNode, node => {
        inTheSameTree = node.parentId === dropNode.id
        if (inTheSameTree) return false
      })

      if (inTheSameTree) return

      const { x: dropX, y: dropY } = event.target.getBoundingClientRect()
      const { x: dragX, y: dragY } = event.relatedTarget.getBoundingClientRect()

      const newGrid = {}
      for (const breakpoint in dragNode.grid) {
        const currentGrid = dragNode.grid[breakpoint]

        const dragW = unitConvert(dragNode.id, currentGrid.w, currentGrid.unitW, 'px')
        const dragH = unitConvert(dragNode.id, currentGrid.h, currentGrid.unitH, 'px')

        newGrid[breakpoint] = {
          x: dragX - dropX,
          y: dragY - dropY,
          w: unitConvert(dropNode.id, dragW, 'px', currentGrid.unitW),
          h: unitConvert(dropNode.id, dragH, 'px', currentGrid.unitH),
          unitW: currentGrid.unitW,
          unitH: currentGrid.unitH
        }

        // if (isNaN(newGrid[breakpoint].w)) debugger
      }

      this.$nextTick(() => {
        // the $nextTick here will make this record after the grid-item layout-updated event when dragged
        // otherwise layout-updated will cause a bug
        this.debounceRecord([
          {
            path: [dragNode.id, 'grid'],
            value: newGrid
          },
          {
            path: [dragNode.id, 'parentId'],
            value: dropNode.id
          }
        ])
      })
    },
    layoutUpdated(newChildren) {
      if (this.isExample) {
        return
      }
      // 不要在這裡更新 innerChildren, 不然undo redo會有回圈
      const records = []

      newChildren.forEach((child, index) => {
        const oldGrid = getValueByPath(
          this.innerChildren,
          [index, GRID, this.currentBreakpoint],
          {}
        )

        const oldValue = {
          x: oldGrid.x,
          y: oldGrid.y,
          h: oldGrid.h,
          w: oldGrid.w,
          unitH: oldGrid.unitH,
          unitW: oldGrid.unitW
        }

        if (process.env.NODE_ENV !== 'production' && child.w === 1) {
          console.warn(`${this.id}.width === 1`)
        }

        const newValue = {
          x: child.x,
          y: child.y,
          h: child.h,
          w: child.w,
          unitH: child.unitH,
          unitW: child.unitW
        }

        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          records.push({
            path: `${child.id}.${GRID}.${this.currentBreakpoint}`,
            value: { ...oldValue, ...newValue }
          })
        }
      })

      if (records.length) {
        this.debounceRecord(records)
      }
    }
  }
}
</script>
