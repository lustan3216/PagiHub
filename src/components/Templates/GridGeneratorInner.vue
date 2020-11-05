<template>
  <vue-grid-generator
    ref="gridGenerator"
    v-bind="innerProps"
    :layout="layout"
    :col-num="windowWidth"
    :vertical-compact="false"
    :is-draggable="isDraftMode"
    :is-resizable="isDraftMode"
    :auto-height="shouldAutoHeight"
    :extra-style="extraStyle"
    :data-addable-id="id"
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
import { isBackground, isSlider } from '@/utils/node'
import EventController from '../TemplateUtils/EventController'

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
    shouldAutoHeight() {
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
