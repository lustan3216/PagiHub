<template>
  <vue-grid-generator
    ref="gridGenerator"
    v-bind="innerProps"
    :layout="layout"
    :margin="[0, 0]"
    :row-height="1"
    :col-num="100"
    :vertical-compact="false"
    :is-draggable="isDraftMode"
    :is-resizable="isDraftMode"
    :lock-item-in-layout="autoUpdateHeight"
    prevent-collision
    @layout-updated="layoutUpdated($event)"
  >
    <component-giver
      v-for="child in children"
      :key="child.id"
      :id="child.id"
    />
  </vue-grid-generator>
</template>

<script>
import { mapGetters } from 'vuex'
import { GRID } from '@/const'
import GridLayout from '@/vendor/vue-grid-layout/components/GridLayout'
import childrenMixin from '@/components/Templates/mixins/children'
import { toPrecision } from '@/utils/number'
import { getValueByPath } from '@/utils/tool'
import { isComponentSet } from '@/utils/node'

export default {
  name: 'GridGeneratorInner',
  components: {
    VueGridGenerator: GridLayout,
    // 因為loop call AsyncComponent, 這裏不用 async import 會噴bug
    ComponentGiver: () => import('../TemplateUtils/ComponentGiver')
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
    }
  },
  data() {
    return {
      layouts: {}
    }
  },
  computed: {
    ...mapGetters('layout', ['currentBreakpoint']),
    autoUpdateHeight() {
      return !this.rootLayout && !['scroll', 'hidden'].includes(this.overflow)
    },
    overflow() {
      return getValueByPath(this.node.parentNode, 'styles.html.overflow')
    },
    rootLayout() {
      return isComponentSet(this.node.parentNode)
    },
    layout() {
      return Object.values(this.layouts)
    }
  },
  methods: {
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
          unitH: oldGrid.unitH
        }

        let h = child.h

        if (child.unitH === 'vh') {
          h = h / this.vh
        }

        if (process.env.NODE_ENV !== 'production' && child.w === 1) {
          console.warn(`${this.id}.width === 1`)
        }

        const newValue = {
          x: child.x,
          y: child.y,
          h: toPrecision(h, 0),
          w: child.w,
          unitH: child.unitH
        }

        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          records.push({
            path: `${child.id}.${GRID}.${this.currentBreakpoint}`,
            value: { ...oldValue, ...newValue }
          })
        }
      })

      if (records.length) {
        this.RECORD(records)
      }
    }
  }
}
</script>
