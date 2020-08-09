<template>
  <el-tooltip
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
import { Tooltip } from 'element-ui'

export default {
  name: 'Hidden',
  components: {
    ElTooltip: Tooltip
  },
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
      const { props } = this.node
      return props[this.breakpoint].hidden
    }
  },
  methods: {
    ...mapMutations('component', ['RECORD']),
    record() {
      if (this.hidden) {
        this.RECORD({
          path: `${this.id}.props.${this.breakpoint}.hidden`,
          value: undefined
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
