<template>
  <el-input
    ref="input"
    v-model="innerNumber"
    :class="{ 'ns-resize': resizeCursor }"
    :prefix-icon="prefixIcon"
    :step="shiftPress ? step * 10 : step"
    :min="allowNegative ? Infinity : min"
    :max="max"
    :disabled="disabled"
    :clearable="clearable"
    type="number"
    class="number"
    @keydown.shift.native="shiftPress = true"
    @keyup.shift.native="shiftPress = false"
    @mousedown.native="mousedown"
    @focus="resizeCursor = false"
    @blur="resizeCursor = true"
    @change="$emit('change', innerValue)"
    @clear="$emit('clear')"
  >
    <el-dropdown
      v-if="optionUnits.length > 1"
      slot="append"
      :disabled="disabled"
      size="small"
      class="pointer"
      @command="innerUnit = $event"
    >
      <span class="title">
        {{ innerUnit }}
      </span>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="unit in optionUnits"
          :key="unit"
          :command="unit"
          class="sub-title"
        >
          {{ unit }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <span
      v-else
      slot="append"
      class="no-action"
    >
      {{ optionUnits.length ? optionUnits[0] : ' - ' }}
    </span>
  </el-input>
</template>

<script>
import { toPrecision } from '@/utils/number'

export default {
  name: 'SelectUnit',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    prefixIcon: {
      type: String,
      default: ''
    },
    clearable: {
      type: Boolean,
      default: true
    },
    hasAuto: {
      type: Boolean,
      default: false
    },
    allowNegative: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: Infinity
    },
    step: {
      type: Number,
      default: 1
    },
    value: {
      validator() {
        return true
      },
      default: null
    },
    number: {
      type: [String, Number]
    },
    unit: {
      type: String
    },
    units: {
      type: [Array, String],
      default: () => ['px', '%']
    },
    separate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const precision = this.step.toString().replace(/\d*\.?/, '').length

    return {
      precision,
      resizeCursor: true,
      clicking: false,
      lastPosition: null,
      innerValue: this.value,
      shiftPress: false
    }
  },
  computed: {
    isStringUnit() {
      return typeof this.units === 'string'
    },
    optionUnits() {
      let units
      if (this.isStringUnit) {
        units = [this.unit]
      }
      else {
        units = this.units
      }

      if (this.hasAuto) {
        return ['auto', ...units]
      }
      else {
        return units
      }
    },
    match() {
      if (this.isInvalid(this.innerValue)) {
        return ['', '']
      }
      else {
        // eslint-disable-next-line
        const [_, unit] =
          this.innerValue.toString().match(/-?[.\d]+(.+)?/) || []
        return [parseFloat(this.innerValue), unit]
      }
    },
    innerNumber: {
      get() {
        if (this.separate) {
          return this.number
        }
        else {
          return toPrecision(this.match[0], this.precision)
        }
      },
      set(number) {
        let result

        if (this.isInvalid(number)) {
          result = 0
        }
        else {
          result = toPrecision(number, this.precision)
        }

        if (result > this.max) {
          result = this.max
        }

        if (result < this.min) {
          result = this.min
        }

        if (this.separate) {
          this.$emit('update:number', result.toString())
          this.innerValue = result.toString()
        }
        else {
          if (this.innerUnit) {
            result += this.innerUnit
          }
          this.$emit('input', result)
          this.innerValue = result
        }
      }
    },
    innerUnit: {
      get() {
        if (this.separate) {
          return this.unit
        }
        else {
          if (this.isStringUnit) {
            return this.units
          }

          const { length } = this.units
          if (length === 1) {
            return this.units[0]
          }
          else if (length === 0) {
            return ''
          }
          else {
            return this.match[1] || this.units[0]
          }
        }
      },
      set(unit) {
        const isAuto = unit === 'auto'
        const number = isAuto ? '' : this.innerNumber || '0'

        if (isAuto) {
          this.$emit('update:value', '0')
        }

        if (this.separate) {
          this.$emit('update:unit', unit)
        }
        else {
          this.$emit('input', this.innerValue)
        }

        this.innerValue = number + unit
      }
    },
    isAuto() {
      return this.innerUnit === 'auto'
    }
  },
  watch: {
    value(value) {
      this.innerValue = value
    }
  },
  methods: {
    releaseClick() {
      this.clicking = false
      this.lastPosition = 0
      document.removeEventListener('mousemove', this.handleMousemove)
      document.removeEventListener('mouseup', this.releaseClick)
    },
    mousedown(e) {
      this.clicking = true
      this.lastPosition = e.clientY

      document.addEventListener('mousemove', this.handleMousemove)
      document.addEventListener('mouseup', this.releaseClick)
    },
    handleMousemove(e) {
      if (!this.clicking) return

      const value = this.lastPosition > e.clientY ? this.step : -1 * this.step

      if (this.number + value < this.min || this.number + value > this.max) {
        return
      }

      this.innerNumber += value
    },
    isInvalid(value) {
      return (
        value === null ||
        value === 'none' ||
        value === '' ||
        value === undefined
      )
    },
    focus() {
      this.$refs.input.focus()
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep {
  .el-input-group__append,
  .el-input-group__prepend {
    width: 30px;
  }
  .el-input.is-disabled .el-input-group__append .el-input__inner {
    cursor: inherit;
  }

  .el-input-group__append {
    padding: 0;
  }

  &.ns-resize {
    & input {
      cursor: ns-resize;
    }
  }
}
</style>
