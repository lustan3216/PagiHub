<template>
  <i
    v-if="iconOnly"
    :class="[currentButtonConfig.class, currentButtonConfig.icon]"
  />
  <el-tooltip
    v-else
    :content="`Set view port to ${point}px width`"
    effect="light"
    placement="bottom"
  >
    <el-button
      :type="type || (point === currentBreakpoint ? 'primary' : 'text')"
      :class="currentButtonConfig.class"
      :icon="currentButtonConfig.icon"
      :size="size"
      class="shortcut-button"
      plain
      @click="$emit('click')"
    />
  </el-tooltip>
</template>

<script>
import { mapGetters } from 'vuex'
import { getValueByPath } from '@/utils/tool'

export default {
  name: 'ButtonDevice',
  props: {
    point: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'mini'
    },
    iconOnly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters('layout', ['currentBreakpoint']),
    buttonConfigs() {
      return [
        { width: 1440, icon: 'el-icon-data-line' },
        { width: 1200, icon: 'el-icon-data-line' },
        { width: 996, icon: 'el-icon-monitor' },
        { width: 768, icon: 'el-icon-mobile' },
        {
          width: 576,
          icon: 'el-icon-mobile-phone',
          class: 'rotate90'
        },
        {
          width: 0,
          icon: 'el-icon-mobile-phone'
        }
      ]
    },
    currentButtonConfig() {
      return (
        this.buttonConfigs.find((config, index) => {
          if (
            this.point <
              getValueByPath(this.buttonConfigs, [index - 1, 'width']) &&
            this.point >= config.width
          ) {
            return config
          }
        }) || this.buttonConfigs[0]
      )
    }
  }
}
</script>

<style scoped lang="scss"></style>
