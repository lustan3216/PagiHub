<template>
  <span>
    <el-tooltip
      :content="`Set the viewport to ${validBreakpointPixels.lg}px`"
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
      :content="`Set the viewport to ${validBreakpointPixels.md}px`"
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
      :content="`Set the viewport to ${validBreakpointPixels.sm}px`"
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
      :content="`Set the viewport to ${validBreakpointPixels.xs}px`"
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
      :content="`Set the viewport to ${validBreakpointPixels.xxs}px`"
      effect="light"
      placement="bottom"
    >
      <el-button
        :type="breakpoint === 'xxs' ? 'primary' : 'text'"
        plain
        icon="el-icon-mobile-phone"
      />
    </el-tooltip>

    <el-dropdown
      size="small"
      @command="handleCommand"
    >
      <el-button size="mini">
        <span class="grey-font">
          {{ artBoardWidth }} X {{ artBoardHeight }}
        </span>
      </el-button>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="option in deviceOptions"
          :key="option.name"
          :value="option.name"
          :command="option.name"
        >
          <div class="justify-between">
            <span class="grey-font">{{ option.name }}</span>
            <span
              class="m-l-15 grey-font"
            >{{ option.w }} X {{ option.h }}</span>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </span>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'ViewPortController',
  computed: {
    ...mapState('layout', ['breakpoint', 'artBoardHeight', 'artBoardWidth']),
    ...mapGetters('layout', ['validBreakpointPixels']),
    deviceOptions() {
      return [
        { name: 'iMac', w: 2560, h: 1440 },
        { name: 'MaxBook Pro', w: 1440, h: 900 },
        { name: 'Surface Pro 4', w: 1368, h: 912 },
        { name: 'Surface Pro 3', w: 1440, h: 960 },
        { name: 'iPhone 11 Pro Max', w: 414, h: 896 },
        { name: 'iPhone 11 Pro', w: 375, h: 812 },
        { name: 'iPhone 11', w: 414, h: 896 },
        { name: 'iPhone 8 Plus', w: 414, h: 736 },
        { name: 'iPhone 8', w: 375, h: 667 },
        { name: 'iPhone 8 SE', w: 320, h: 568 },
        { name: 'Google Pixel 4 XL', w: 360, h: 760 },
        { name: 'Google Pixel 4', w: 360, h: 769 },
        { name: 'Google Pixel 3 XL', w: 411, h: 846 },
        { name: 'Google Pixel 3', w: 411, h: 822 },
        { name: 'iPad Pro 12.9"', w: 1024, h: 1366 },
        { name: 'iPad Pro 11"', w: 834, h: 1194 },
        { name: 'iPad Air 10.5"', w: 834, h: 1112 },
        { name: 'iPad 10.2"', w: 810, h: 1080 },
        { name: 'iPad Mini', w: 768, h: 1024 }
      ]
    }
  },
  methods: {
    handleCommand() {}
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
