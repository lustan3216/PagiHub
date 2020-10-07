<template>
  <b-icon-laptop
    v-if="iconOnly && buttonConfig.icon === 'laptop'"
    style="margin-bottom: -2px;"
  />
  <i
    v-else-if="iconOnly"
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
      :size="size"
      class="shortcut-button"
      plain
      @click="$emit('click', point)"
    >
      <b-icon-laptop
        v-if="buttonConfig.icon === 'laptop'"
        style="margin-bottom: -2px;"
      />
      <i
        v-else
        :class="buttonConfig.icon"
      />
    </el-button>
  </el-tooltip>
</template>

<script>
import { mapGetters } from 'vuex'
import { BREAK_POINTS_MAP } from '@/const'
import { BIconLaptop } from 'bootstrap-vue'

export default {
  name: 'ButtonDevice',
  components: {
    BIconLaptop
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
      return BREAK_POINTS_MAP[this.pointKey] || 320
    },
    buttonConfig() {
      return {
        xxl: {
          icon: 'el-icon-data-line'
        },
        xl: {
          icon: 'el-icon-monitor'
        },
        lg: {
          icon: 'laptop'
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
