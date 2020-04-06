<template>
  <span
    v-clickoutside="hide"
    class="el-color-picker ql-picker ql-color-picker"
    @click="showPicker = !showPicker"
  >
    <span ref="icon" class="ql-picker-label">
      <slot />
    </span>
    <picker-dropdown
      :show-alpha="showAlpha"
      :color="color"
      v-model="showPicker"
      class="el-color-picker__panel"
      @pick="confirmValue"
      @clear="clearValue"
    />
  </span>
</template>

<script>
// import ElColorPickerDropdown from 'element-ui/packages/color-picker/src/components/picker-dropdown'
import Color from 'element-ui/packages/color-picker/src/color'
import PickerDropdown from 'element-ui/packages/color-picker/src/components/picker-dropdown'
import Clickoutside from 'element-ui/src/utils/clickoutside'
export default {
  name: 'ColorPicker',
  components: {
    PickerDropdown
  },
  directives: { Clickoutside },
  props: {
    value: {
      type: String,
      required: true
    },
    colorFormat: {
      type: String,
      default: 'rgb'
    },
    showAlpha: {
      type: Boolean,
      default: true
    }
  },
  data() {
    const color = new Color({
      enableAlpha: this.showAlpha,
      format: this.colorFormat
    })

    return {
      color,
      showPicker: false
    }
  },
  computed: {
    displayedColor() {
      if (!this.value && !this.showPanelColor) {
        return 'transparent'
      }

      return this.displayedRgb(this.color, this.showAlpha)
    }
  },
  watch: {
    value(val) {
      if (val && val !== this.color.value) {
        this.color.fromString(val)
      }
    },
    color: {
      handler({ value }) {
        const colorLabel = this.$refs.icon.querySelector('.ql-color-label')
        if (colorLabel) {
          colorLabel.style.stroke = value
          colorLabel.style.fill = value
        }
      },
      deep: true
    },
    displayedColor() {
      if (!this.showPicker) return
      const currentValueColor = new Color({
        enableAlpha: this.showAlpha,
        format: this.colorFormat
      })
      currentValueColor.fromString(this.value)
    }
  },
  mounted() {
    const value = this.value
    if (value) {
      this.color.fromString(value)
    }
  },
  methods: {
    confirmValue() {
      const value = this.color.value
      this.$emit('input', value)
      this.$emit('change', value)
      this.showPicker = false
    },
    clearValue() {
      this.$emit('input', null)
      this.$emit('change', null)
      this.showPicker = false
      this.resetColor()
    },
    resetColor() {
      this.$nextTick(_ => {
        if (this.value) {
          this.color.fromString(this.value)
        }
      })
    },
    displayedRgb(color, showAlpha) {
      if (!(color instanceof Color)) {
        throw Error('color should be instance of Color Class')
      }

      const { r, g, b } = color.toRgb()
      return showAlpha
        ? `rgba(${r}, ${g}, ${b}, ${color.get('alpha') / 100})`
        : `rgb(${r}, ${g}, ${b})`
    },
    hide() {
      this.showPicker = false
      this.resetColor()
    }
  }
}
</script>

<style scoped lang="scss"></style>
