<template>
  <component v-if="iconOnly" :is="buttonConfig.icon" />
  <el-tooltip
    v-else
    :content="`Set view port to ${point}px width`"
    effect="light"
    placement="bottom"
  >
    <el-button
      :type="computedType"
      :class="buttonConfig.class"
      :size="size"
      class="shortcut-button"
      plain
      @click="$emit('click', point)"
    >
      <component :is="buttonConfig.icon" />
    </el-button>
  </el-tooltip>
</template>

<script>
import { mapState } from 'vuex'
import { BREAK_POINTS_MAP } from '@/const'
import { BIconLaptop, BIconDisplay, BIconTabletLandscape, BIconTablet, BIconPhoneLandscape, BIconPhone } from 'bootstrap-vue'

export default {
  name: 'ButtonDevice',
  components: {
    BIconDisplay,
    BIconLaptop,
    BIconTabletLandscape,
    BIconTablet,
    BIconPhoneLandscape,
    BIconPhone
  },
  props: {
    pointKey: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: ''
    },
    active: {
      type: Boolean,
      default: null
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
    ...mapState('layout', ['currentBreakpoint']),
    computedType() {
      if (this.type) {
        return this.type
      }
      else if (this.active !== null) {
        return this.active ? 'primary' : 'text'
      }
      else {
        return this.pointKey === this.currentBreakpoint ? 'primary' : 'text'
      }
    },
    point() {
      return BREAK_POINTS_MAP[this.pointKey] || 320
    },
    buttonConfig() {
      return {
        xl: {
          icon: 'BIconDisplay'
        },
        lg: {
          icon: 'BIconLaptop'
        },
        md: {
          icon: 'BIconTabletLandscape'
        },
        sm: {
          icon: 'BIconTablet'
        },
        xs: {
          icon: 'BIconPhoneLandscape'
        },
        xxs: {
          icon: 'BIconPhone'
        }
      }[this.pointKey]
    }
  }
}
</script>

<style scoped lang="scss">
.el-button:hover {
  border-color: transparent;
}
</style>
