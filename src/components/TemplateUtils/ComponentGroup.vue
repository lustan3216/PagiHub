<script>
import { cloneJson } from '@/utils/tool'
import { arrayUniq } from '@/utils/array'
import { isGroup, closestValidBreakpoint } from '@/utils/node'
import { mapActions, mapGetters } from 'vuex'
import { BREAK_POINTS_ARRAY, GRID } from '@/const'
import { group } from '@/templateJson/basic'
import { vmAddNodeToParent, vmRemoveNode } from '@/utils/vmMap'

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
      const rect = {
        minX: Infinity,
        minY: Infinity,
        maxX: 0,
        maxY: 0
      }

      this.selectedComponentNodes.forEach(node => {
        const point = closestValidBreakpoint(node, this.currentBreakpoint)
        const { x, y, w, h } = node.grid[point]
        if (x <= rect.minX) rect.minX = x
        if (y <= rect.minY) rect.minY = y
        if (x + w >= rect.maxX) rect.maxX = x + w
        if (y + h >= rect.maxY) rect.maxY = y + h
      })

      const children = this.selectedComponentNodes.map(node => {
        node = cloneJson(node)
        const currentGrid = node.grid[this.currentBreakpoint]
        node.grid = {
          [this.currentBreakpoint]: {
            x: currentGrid.x - rect.minX,
            y: currentGrid.y - rect.minY,
            w: currentGrid.w,
            h: currentGrid.h
          }
        }

        return node
      })

      const tree = group({
        grid: {
          [this.currentBreakpoint]: {
            x: rect.minX,
            y: rect.minY,
            w: rect.maxX - rect.minX,
            h: rect.maxY - rect.minY
          }
        },
        children
      })
      vmAddNodeToParent(children[0].parentId, tree)
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
