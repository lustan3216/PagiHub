<template>
  <!--  data-addable-id 不能刪，add element要用的-->
  <!-- :id 不能刪， 要印在dom上，data-image-droppable or data-droppable會用 -->
  <vue-grid-generator
    ref="gridGenerator"
    v-bind="innerProps"
    :id="id"
    :layout="layout"
    :col-num="windowWidth"
    :vertical-compact="false"
    :is-droppable="isDroppable && isDraftMode"
    :is-draggable="isDraftMode"
    :is-resizable="isDraftMode"
    :auto-extend-height="autoExtendHeight"
    :extra-style="extraStyle"
    :data-addable-id="id"
    :data-droppable="isDroppable ? '' : undefined"
    @drop="handleDrop"
    @layout-updated="layoutUpdated($event)"
  >
    <portal-target
      :name="`GridInner-${id}`"
      multiple
    />

    <event-controller
      v-if="controller && isDraftMode && element"
      :id="id"
      :element="element"
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
import { isGroup, traversalSelfAndChildren } from '@/utils/node'
import EventController from '../TemplateUtils/EventController'
import { horizontalUnitConvert, verticalUnitConvert } from '@/utils/layout'

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
    extraStyle: {
      type: Object,
      default: () => ({})
    },
    controller: {
      type: Boolean,
      default: false
    },
    autoExtendHeight: {
      type: Boolean,
      default: true
    },
    isDroppable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      layouts: {},
      element: null
    }
  },
  computed: {
    ...mapState('app', ['isAdding']),
    ...mapState('layout', ['windowWidth']),
    ...mapGetters('layout', ['currentBreakpoint']),
    layout() {
      return Object.values(this.layouts)
    }
  },
  mounted() {
    this.element = this.$el
  },
  methods: {
    ...mapActions('node', ['debounceRecord']),
    handleDrop(event) {
      if (this.isAdding) return

      const droppableId = event.target.closest('[data-droppable]').id
      const dropNode = this.nodesMap[droppableId]
      const dragNode = event.relatedTarget.__vue__.node

      if (!dragNode || isGroup(dragNode.parentNode)) {
        return
      }

      if (!dropNode || !dragNode) return
      let inTheSameFamily = false

      traversalSelfAndChildren(dropNode, node => {
        inTheSameFamily = node.parentId === dragNode.id
        if (inTheSameFamily) return false
      })

      if (inTheSameFamily) return

      traversalSelfAndChildren(dragNode, node => {
        inTheSameFamily = node.parentId === dropNode.id
        if (inTheSameFamily) return false
      })

      if (inTheSameFamily) return

      const { x: dropX, y: dropY } = event.target.getBoundingClientRect()
      const { x: dragX, y: dragY } = event.relatedTarget.getBoundingClientRect()

      const newGrid = {}
      for (const breakpoint in dragNode.grid) {
        const currentGrid = dragNode.grid[breakpoint]

        const dragW = horizontalUnitConvert(dragNode.id, currentGrid.w, currentGrid.unitW, 'px')
        const dragH = verticalUnitConvert(dragNode.id, currentGrid.h, currentGrid.unitH, 'px')

        newGrid[breakpoint] = {
          x: dragX - dropX,
          y: dragY - dropY,
          w: horizontalUnitConvert(dropNode.id, dragW, 'px', currentGrid.unitW),
          h: verticalUnitConvert(dropNode.id, dragH, 'px', currentGrid.unitH),
          unitW: currentGrid.unitW,
          unitH: currentGrid.unitH,
          unitX: currentGrid.unitX,
          unitY: currentGrid.unitY
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
          unitW: oldGrid.unitW,
          unitX: oldGrid.unitX,
          unitY: oldGrid.unitY
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
          unitW: child.unitW,
          unitX: child.unitX,
          unitY: child.unitY
        }

        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          records.push({
            path: [child.id, GRID, this.currentBreakpoint],
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
