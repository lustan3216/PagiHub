<template>
  <el-tooltip
    effect="light"
    content="Enable to free drag"
    placement="top"
  >
    <el-button
      :type="hasIndex ? 'primary' : 'text'"
      plain
      icon="el-icon-s-opportunity"
      @click="click"
    />
  </el-tooltip>
</template>

<script>
import { Tooltip } from 'element-ui'
import { mapActions, mapState } from 'vuex'
import { arrayLast } from '@/utils/array'
import { getValueByPath } from '@/utils/tool'
import { STYLES } from '@/const'

export default {
  name: 'ZIndex',
  components: {
    ElTooltip: Tooltip
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    lastId() {
      return arrayLast(this.selectedComponentIds)
    },
    isLastOne() {
      return this.lastId === this.id
    },
    node() {
      return this.nodesMap[this.lastId]
    },
    hasIndex() {
      return getValueByPath(this.node, [STYLES, 'layout', 'zIndex'])
    }
  },
  methods: {
    ...mapActions('node', ['record']),
    click() {
      this.record({
        path: [this.lastId, STYLES, 'layout', 'zIndex'],
        value: this.hasIndex ? undefined : 1
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
