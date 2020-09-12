<template>
  <el-tooltip
    v-if="hidden"
    effect="light"
    content="Hidden on current window width, click to display."
    placement="bottom"
  >
    <el-button
      :icon="hovering ? 'el-icon-video-play' : 'el-icon-video-pause'"
      type="text"
      @mouseenter.native="hovering = true"
      @mouseleave.native="hovering = false"
      @click="record"
    />
  </el-tooltip>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { getValueByPath } from '@/utils/tool'
import { STYLES } from '@/const'

export default {
  name: 'Hidden',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      hovering: false
    }
  },
  computed: {
    ...mapState('app', ['breakpoint']),
    node() {
      return this.nodesMap[this.id]
    },
    hidden() {
      return getValueByPath(this.node, [STYLES, this.breakpoint, 'hidden'])
    }
  },
  methods: {
    ...mapMutations('node', ['RECORD']),
    record() {
      if (this.hidden) {
        this.RECORD({
          path: `${this.id}.${STYLES}.${this.breakpoint}.hidden`,
          value: undefined
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
