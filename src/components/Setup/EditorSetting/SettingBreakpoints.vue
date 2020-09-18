<template>
  <el-popover
    placement="bottom"
    width="300"
    trigger="click"
  >
    <h4 style="margin: 10px 0 15px;">Add breakpoints</h4>

    <el-divider />

    <div v-for="(value, key, index) in validBreakpointPixels">
      {{ value }} - {{  }}
      <el-button icon="el-icon-video-pause">Disable</el-button>
    </div>

    <el-button
      slot="reference"
      class="m-r-10 m-l-15"
      type="text"
      icon="el-icon-more-outline"
    />
  </el-popover>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Popover } from 'element-ui'
import SliderPoints from '@/components/Components/SliderPoints'

export default {
  name: 'SettingBreakpoints',
  components: {
    SliderPoints,
    ElPopover: Popover
  },
  computed: {
    ...mapState('layout', ['breakpointPixels']),
    ...mapGetters('layout', ['validBreakpointPixels'])
  }
}
</script>

<style scoped lang="scss"></style>
