<template>
  <el-button
    :type="hasIndex ? 'primary' : 'text'"
    plain
    icon="el-icon-s-opportunity"
    @click="click"
  />
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { arrayLast } from '@/utils/array'
import { getNode } from '@/utils/node'
import { getValueByPath } from '@/utils/tool'
import { STYLES } from '@/const'

export default {
  name: 'ZIndex',
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
    hasIndex() {
      return getValueByPath(this.node, [STYLES, 'layout', 'zIndex'])
    }
  },
  methods: {
    ...mapMutations('node', ['RECORD']),
    click() {
      this.RECORD({
        path: [this.lastId, STYLES, 'layout', 'zIndex'],
        value: 1
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
