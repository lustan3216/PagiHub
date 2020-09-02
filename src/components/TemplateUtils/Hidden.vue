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
      return this.componentsMap[this.id]
    },
    hidden() {
      return getValueByPath(this.node, ['style', this.breakpoint, 'hidden'])
    }
  },
  methods: {
    ...mapMutations('node', ['RECORD']),
    record() {
      if (this.hidden) {
        this.RECORD({
          path: `${this.id}.style.${this.breakpoint}.hidden`,
          value: undefined
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
