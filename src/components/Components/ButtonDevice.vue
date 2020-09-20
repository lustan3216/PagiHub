<template>
  <i
    v-if="iconOnly"
    :class="[buttonConfig.class, buttonConfig.icon]"
  />
  <el-tooltip
    v-else
    :content="`Set view port to ${point}px width`"
    effect="light"
    placement="bottom"
  >
    <el-button
      :type="type || (pointKey === currentBreakpoint ? 'primary' : 'text')"
      :class="buttonConfig.class"
      :icon="buttonConfig.icon"
      :size="size"
      class="shortcut-button"
      plain
      @click="$emit('click', point)"
    />
  </el-tooltip>
</template>

<script>
import { mapGetters } from 'vuex'
import { BREAK_POINTS_MAP } from '@/const'

export default {
  name: 'ButtonDevice',
  props: {
    pointKey: {
      type: String,
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
    point() {
      return BREAK_POINTS_MAP[this.pointKey]
    },
    buttonConfig() {
      return {
        xxl: {
          icon: 'el-icon-data-line'
        },
        xl: {
          icon: 'el-icon-data-line'
        },
        lg: {
          icon: 'el-icon-monitor'
        },
        md: {
          icon: 'el-icon-mobile'
        },
        sm: {
          icon: 'el-icon-mobile-phone',
          class: 'rotate90'
        },
        xs: {
          icon: 'el-icon-mobile-phone'
        }
      }[this.pointKey]
    }
  }
}
</script>

<style scoped lang="scss"></style>
