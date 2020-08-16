<template>
  <span>
    <el-tooltip
      :content="`Set the viewport to ${breakpoints.lg}px`"
      effect="light"
      placement="bottom"
    >
      <el-button
        :type="breakpoint === 'lg' ? 'primary' : 'text'"
        plain
        icon="el-icon-data-line"
      />
    </el-tooltip>

    <el-tooltip
      :content="`Set the viewport to ${breakpoints.md}px`"
      effect="light"
      placement="bottom"
    >
      <el-button
        :type="breakpoint === 'md' ? 'primary' : 'text'"
        plain
        icon="el-icon-monitor"
      />
    </el-tooltip>

    <el-tooltip
      :content="`Set the viewport to ${breakpoints.sm}px`"
      effect="light"
      placement="bottom"
    >
      <el-button
        :type="breakpoint === 'sm' ? 'primary' : 'text'"
        plain
        icon="el-icon-mobile"
      />
    </el-tooltip>

    <el-tooltip
      :content="`Set the viewport to ${breakpoints.xs}px`"
      effect="light"
      placement="bottom"
    >
      <el-button
        :type="breakpoint === 'xs' ? 'primary' : 'text'"
        plain
        class="rotate90"
        icon="el-icon-mobile-phone"
      />
    </el-tooltip>

    <el-tooltip
      :content="`Set the viewport to ${breakpoints.xxs}px`"
      effect="light"
      placement="bottom"
    >
      <el-button
        :type="breakpoint === 'xxs' ? 'primary' : 'text'"
        plain
        icon="el-icon-mobile-phone"
      />
    </el-tooltip>
  </span>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { BREAK_POINTS } from '@/const'

export default {
  name: 'ViewPortController',
  computed: {
    ...mapState('app', ['breakpoint']),
    breakpoints() {
      return BREAK_POINTS
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
  .el-button {
    font-size: 16px;
    padding: 7px;
    margin: 5px 10px;
  }
</style>
