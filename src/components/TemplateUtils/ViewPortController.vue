<template>
  <span>
    <el-tooltip
      :content="`Set the viewport to ${breakpoints.lg}px`"
      effect="light"
      placement="bottom"
    >
      <el-button
        plain
        icon="el-icon-data-line"
        :type="breakpoint === 'lg' ? 'primary' : 'text'"
      />
    </el-tooltip>

    <el-tooltip
      :content="`Set the viewport to ${breakpoints.md}px`"
      effect="light"
      placement="bottom"
    >
      <el-button
        plain
        icon="el-icon-monitor"
        :type="breakpoint === 'md' ? 'primary' : 'text'"
      />
    </el-tooltip>

    <el-tooltip
      :content="`Set the viewport to ${breakpoints.sm}px`"
      effect="light"
      placement="bottom"
    >
      <el-button
        plain
        icon="el-icon-mobile"
        :type="breakpoint === 'sm' ? 'primary' : 'text'"
      />
    </el-tooltip>

    <el-tooltip
      :content="`Set the viewport to ${breakpoints.xs}px`"
      effect="light"
      placement="bottom"
    >
      <el-button
        plain
        class="rotate90"
        icon="el-icon-mobile-phone"
        :type="breakpoint === 'xs' ? 'primary' : 'text'"
      />
    </el-tooltip>

    <el-tooltip
      :content="`Set the viewport to ${breakpoints.xxs}px`"
      effect="light"
      placement="bottom"
    >
      <el-button
        plain
        icon="el-icon-mobile-phone"
        :type="breakpoint === 'xxs' ? 'primary' : 'text'"
      />
    </el-tooltip>
  </span>
</template>

<script>
  import { mapMutations, mapState } from 'vuex'
  import { BREAK_POINTS } from '@/const'
  import { Tooltip } from 'element-ui'

  export default {
    name: 'ViewPortController',
    components: {
      ElTooltip: Tooltip
    },
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
