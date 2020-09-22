<template>
  <el-tooltip
    effect="light"
    content="Stack Mode. It will push other stack container when colliding."
    placement="top"
  >
    <el-button
      :type="isStack ? 'primary' : 'text'"
      plain
      icon="el-icon-s-opportunity"
      @click="click"
    />
  </el-tooltip>
</template>

<script>
import { Tooltip } from 'element-ui'
import { mapActions, mapMutations, mapState } from 'vuex'
import { arrayLast } from '@/utils/array'
import { getNode } from '@/utils/node'
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
      return getNode(this.lastId)
    },
    isStack() {
      return getValueByPath(this.node, [STYLES, 'layout', 'stack'])
    }
  },
  methods: {
    ...mapMutations('node', ['RECORD']),
    ...mapActions('layout', ['resizeNodeQuickFn']),
    click() {
      this.RECORD({
        path: [this.lastId, STYLES, 'layout', 'stack'],
        value: this.isStack ? undefined : true
      })

      this.$nextTick(() => {
        this.resizeNodeQuickFn()
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
