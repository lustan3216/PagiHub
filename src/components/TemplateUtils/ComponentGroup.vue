<script>
import { cloneJson } from '@/utils/tool'
import { arrayUniq } from '@/utils/array'
import {
  isGroup,
  closestValidBreakpoint,
  getGroupPxRect,
  closestValidGrid
} from '@/utils/node'
import { mapActions, mapGetters } from 'vuex'
import { BREAK_POINTS_ARRAY, GRID } from '@/const'
import { group } from '@/templateJson/basic'
import { vmAddNodeToParent, vmRemoveNode } from '@/utils/vmMap'
import { unitConvert } from '@/utils/layout'
import { toPrecision } from '@/utils/number'

export default {
  name: 'ComponentGroup',
  computed: {
    ...mapGetters('layout', ['currentBreakpoint']),
    ...mapGetters('app', ['selectedComponentNodes']),
    canGroup() {
      let parentIds = this.selectedComponentNodes.map(node => node.parentId)
      parentIds = arrayUniq(parentIds)
      return parentIds.length === 1
    },
    canUngroup() {
      const groups = this.selectedComponentNodes.filter(node => isGroup(node))
      return (
        groups.length === this.selectedComponentNodes.length && groups.length
      )
    }
  },
  methods: {
    ...mapActions('node', ['record']),
    group() {
      const { x, y, w, h } = getGroupPxRect(this.selectedComponentNodes)
      const { parentId } = this.selectedComponentNodes[0]

      const children = this.selectedComponentNodes.map(node => {
        const currentGrid = closestValidGrid(node, this.currentBreakpoint)
        node = cloneJson(node)

        let nodeW = currentGrid.w
        if (currentGrid.unitW === '%') {
          nodeW = (unitConvert(node.id, currentGrid.w, '%', 'px') / w) * 100
        }

        node.grid = {
          [this.currentBreakpoint]: {
            x: Math.round(currentGrid.x - x),
            y: Math.round(currentGrid.y - y),
            w: toPrecision(nodeW, 1),
            h: Math.round(currentGrid.h),
            unitH: currentGrid.unitH,
            unitW: currentGrid.unitW
          }
          // overwrite all original breakpoint
        }

        return node
      })

      const tree = group({
        grid: {
          [this.currentBreakpoint]: {
            x,
            y,
            w: unitConvert(parentId, w, 'px', '%'),
            h,
            unitH: 'px',
            unitW: '%'
          }
        },
        children
      })
      vmAddNodeToParent(parentId, tree)
      this.selectedComponentNodes.forEach(node => vmRemoveNode(node))
    },
    ungroup() {
      this.selectedComponentNodes.forEach(group => {
        this.departGroup(group)

        this.$nextTick(() => vmRemoveNode(group))
      })
    },
    departGroup(group) {
      const records = []
      group.children.forEach(node => {
        BREAK_POINTS_ARRAY.forEach(point => {
          const grid = node.grid[point]
          if (!grid) return

          if (grid.unitW === '%') {
            const nodePx = unitConvert(node.id, grid.w, '%', 'px')

            records.push({
              path: [node.id, GRID, point, 'w'],
              value: unitConvert(group.id, nodePx, 'px', '%')
            })
          }

          const currentGroupGird = this.closestValidGrid(group, point)
          records.push({
            path: [node.id, GRID, point, 'x'],
            value: node.grid[point].x + currentGroupGird.x
          })
          records.push({
            path: [node.id, GRID, point, 'y'],
            value: node.grid[point].y + currentGroupGird.y
          })
        })

        records.push({
          path: [node.id, 'parentId'],
          value: group.parentId
        })
      })

      this.record(records)
    },
    closestValidGrid(group, currentBreakpoint) {
      const point = closestValidBreakpoint(group, currentBreakpoint)
      return group.grid[point]
    }
  },
  render() {
    return this.$scopedSlots.default({
      canGroup: this.canGroup,
      canUngroup: this.canUngroup,
      group: this.group,
      ungroup: this.ungroup
    })
  }
}
</script>

<style scoped lang="scss"></style>
