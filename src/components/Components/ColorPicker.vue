<template>
  <el-popover
    :width="gradient ? 395 : 420"
    :placement="placement"
    trigger="click"
    popper-class="p-0"
    @after-enter="create"
  >
    <div
      ref="panel"
      class="color-picker"
    />

    <div slot="reference" class="pointer">
      <slot>
        <div class="wrapper">
          <span class="button">
            <div :style="buttonStyle" class="inner"/>
          </span>
        </div>
      </slot>
    </div>
  </el-popover>
</template>

<script>
import { Popover } from 'element-ui'
import GPickr from '@/vendor/gpickr/js/gpickr'
import Pickr from '@simonwep/pickr'
import '@simonwep/pickr/dist/themes/classic.min.css'
export default {
  name: 'ColorPicker',

  components: {
    ElPopover: Popover
  },

  props: {
    gradient: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    placement: {
      type: String,
      default: 'left-end'
    }
  },

  data() {
    return {
      pickr: null,
      visible: false,
      key: 0
    }
  },
  computed: {
    buttonStyle() {
      if (this.gradient) {
        return { backgroundImage: this.value }
      }
      else {
        return { backgroundColor: this.value }
      }
    }
  },
  methods: {
    create() {
      if (this.pickr) {
        return
      }

      if (this.gradient) {
        this.pickr = new GPickr({
          el: this.$refs.panel
        })

        this.pickr.setGradient(this.value)

        this.pickr.on('change', pickr => {
          if (pickr._stops.length < 2) {
            this.$emit('input', '')
          }
          else {
            this.$emit('input', pickr.getGradient())
          }
        })
      }
      else {
        this.pickr = Pickr.create({
          el: this.$refs.panel,
          theme: 'classic', // or 'monolith', or 'nano'
          default: '#42445a',
          inline: true,
          useAsButton: true,
          showAlways: true,
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
              clear: true
            }
          }
        }).on('change', pickr => {
          this.$emit('input', pickr.toHEXA().toString())
        }).on('clear', pickr => {
          this.$emit('input', '')
        })

        this.pickr.setColor(this.value)
      }
    }
  }
}
</script>

<style scoped>
 .button {
   background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);
   position: relative;
   display: block;
   box-sizing: border-box;
   border: 1px solid #999;
   border-radius: 2px;
   width: 100%;
   height: 100%;
   text-align: center;
   cursor: pointer;
 }
 .wrapper {
   height: 28px;
   width: 28px;
   display: inline-block;
   box-sizing: border-box;
   padding: 4px;
   border: 1px solid #e6e6e6;
   border-radius: 4px;
   font-size: 0;
   position: relative;
   cursor: pointer;
 }
 .inner {
   position: absolute;
   left: 0;
   top: 0;
   right: 0;
   bottom: 0;
 }
</style>

