<template>
  <div>
    <el-divider content-position="left">POSITION</el-divider>

    <el-checkbox
      v-if="isStack"
      v-model="verticalCompact"
      :disabled="canNotVerticalCompact"
      class="m-t-10"
      style="margin-bottom: 25px;"
    >
      <span class="font-12">Stick to upper stack mode element's bottom</span>
    </el-checkbox>

    <el-checkbox
      v-else
      v-model="fixed"
      :disabled="canNotFixed"
      class="m-t-10"
      style="margin-bottom: 25px;"
    >
      <span class="font-12">Fix position when scrolling</span>
    </el-checkbox>
  </div>
</template>

<script>
import { Tooltip } from 'element-ui'
import { mapActions, mapGetters, mapState } from 'vuex'
import { getValueByPath } from '@/utils/tool'
import { STYLES } from '@/const'
import { vmGet } from '@/utils/vmMap'
import { arrayLast } from '@/utils/array'
import { isBackground, nodePosition, nodeRelativePosition } from '@/utils/node'
import { horizontalUnitConvert, verticalUnitConvert } from '@/utils/layout'

export default {
  name: 'Position',
  components: {
    ElTooltip: Tooltip
  },
  computed: {
    ...mapState('layout', ['windowHeight']),
    ...mapGetters('app', ['selectedComponentNodes']),
    ...mapGetters('layout', ['currentBreakpoint']),
    canNotFixed() {
      return this.selectedComponentNodes.some(node => !isBackground(node.parentNode))
    },
    canNotVerticalCompact() {
      return this.selectedComponentNodes.some(node => {
        return getValueByPath(node, [STYLES, 'layout', 'stack']) === undefined
      })
    },
    isStack: {
      get() {
        const lastNode = arrayLast(this.selectedComponentNodes)
        if (lastNode) {
          return getValueByPath(lastNode, [STYLES, 'layout', 'stack'])
        }
      }
    },
    verticalCompact: {
      get() {
        const lastNode = arrayLast(this.selectedComponentNodes)
        if (lastNode) {
          return (
            getValueByPath(lastNode, [STYLES, 'layout', 'position']) ===
              'verticalCompact'
          )
        }
      },
      set(value) {
        this.selectedComponentNodes.forEach(node => {
          this.debounceRecord({
            path: [node.id, STYLES, 'layout', 'position'],
            value: value ? 'verticalCompact' : undefined
          })
        })
      }
    },
    fixed: {
      get() {
        const lastNode = arrayLast(this.selectedComponentNodes)
        if (lastNode) {
          return (
            getValueByPath(lastNode, [STYLES, 'layout', 'position']) === 'fixed'
          )
        }
      },
      set(value) {
        this.selectedComponentNodes.forEach(node => {
          if (value) {
            const vm = vmGet(node.id)
            const currentGrid = getValueByPath(vm, ['currentGrid'])
            const { x, y } = nodePosition(node.id)

            this.debounceRecord([
              {
                path: [node.id, STYLES, 'layout', 'position'],
                value: 'fixed'
              },
              {
                path: [node.id, STYLES, 'layout', 'stack'],
                value: undefined
              },
              {
                path: [node.id, 'grid'],
                value: {
                  [this.currentBreakpoint]: {
                    ...currentGrid,
                    unitX: 'vw',
                    unitY: 'vh',
                    x: horizontalUnitConvert(node.id, x, 'px', 'vw'),
                    y: verticalUnitConvert(node.id, y, 'px', 'vh')
                  }
                }
              }
            ])
          }
          else {
            const vm = vmGet(node.id)
            const currentGrid = getValueByPath(vm, ['currentGrid'])
            const { x, y } = nodeRelativePosition(node.id)

            this.debounceRecord([
              {
                path: [node.id, STYLES, 'layout', 'position'],
                value: undefined
              },
              {
                path: [node.id, STYLES, 'layout', 'stack'],
                value: undefined
              },
              {
                path: [node.id, 'grid'],
                value: {
                  [this.currentBreakpoint]: {
                    ...currentGrid,
                    unitX: 'px',
                    unitY: 'px',
                    x,
                    y
                  }
                }
              }
            ])
          }
        })
      }
    }
  },
  methods: {
    ...mapActions('node', ['debounceRecord'])
  }
}
</script>

<style scoped lang="scss">
  .isStack,
  .isStack:hover,
  .isStack:focus {
    background: $color-active;
    color: white !important;
  }

  ::v-deep.el-checkbox {
    display: flex;

    .el-checkbox__input {
      margin-top: 4px;
    }

    .el-checkbox__label {
      white-space: normal;
    }
  }
</style>
