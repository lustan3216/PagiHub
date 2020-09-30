<template>
  <div
    v-if="gradient"
    v-model="visible"
    placement="left"
    width="100%"
    trigger="manual"
    popper-class="p-0"
  >
    <div
      ref="panel"
      class="color-picker"
    />
    <el-button
      slot="reference"
      type="primary"
      @click="visible = !visible"
    />
  </div>
</template>

<script>
/* eslint-disable */
import { Popover } from 'element-ui'
import '@simonwep/pickr/dist/themes/classic.min.css' // 'classic' theme
import GPickr from '@/vendor/gpickr/js/gpickr'
// Modern or es5 bundle (pay attention to the note below!)
import Pickr from '@simonwep/pickr'

export default {
  name: 'ElColorPicker',

  components: {
    ElPopover: Popover
  },

  props: {
    gradient: {
      type: Boolean,
      default: true
    },
    value: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      pickr: null,
      visible: false
    }
  },
  watch: {
    visible(value) {
      if (value && !this.pickr) {
        if (this.gradient) {
          this.pickr = new GPickr({
            el: '.color-picker'
          })

          this.pickr.setGradient(this.value)

          this.pickr.on('change', pickr => {
            this.$emit('input', pickr.getGradient())
          })
        } else {
          this.pickr = Pickr.create({
            el: '.color-picker',
            theme: 'classic', // or 'monolith', or 'nano'
            default: '#42445a',
            components: {
              // Main components
              preview: true,
              opacity: true,
              hue: true,

              // Input / output Options
              interaction: {
                hex: true,
                rgba: true,
                hsla: true,
                input: true,
                clear: true,
                save: true
              }
            }
          })

          this.pickr.on('change', pickr => {
            this.$emit('input', pickr.getColor())
          })
        }
      } else if (this.pickr) {
        if (this.gradient) {
          this.pickr._pickr.destroy()
        } else {
          this.pickr.destroy()
        }
      }
    }
  }
}
</script>
