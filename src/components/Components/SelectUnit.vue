<template>
  <el-select
    v-if="isAuto"
    v-model="unit"
    v-bind="{ ...$attrs, ...$props }"
  >
    <el-option
      v-for="unit in optionUnits"
      :key="unit"
      :value="unit"
    />
  </el-select>

  <!--  @change="$emit('change', innerValue)" for font style, but try to use @input instead of @change-->
  <el-input
    v-else
    ref="input"
    v-model="number"
    :class="{ 'ns-resize': resizeCursor }"
    :prefix-icon="prefixIcon"
    :step="step"
    :min="allowNegative ? Infinity : min"
    :max="max"
    type="number"
    class="number"
    clearable
    @mousedown.native="clicking = true"
    @focus="resizeCursor= false"
    @blur="resizeCursor = true"
    @change="$emit('change', innerValue)"
  >
    <el-dropdown
      v-if="optionUnits.length > 1"
      slot="append"
      size="small"
      class="pointer"
      @command="unit = $event"
    >
      <span class="title">
        {{ unit }}
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
      {{ optionUnits.length ? unit : ' - ' }}
    </span>
  </el-input>
</template>

<script>
import { toPrecision } from '@/utils/number'
export default {
  name: 'SelectUnit',
  props: {
    prefixIcon: {
      type: String,
      default: ''
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
    units: {
      type: [Array, String],
      default: () => ['px', '%', 'vh', 'vw']
    }
  },
  data() {
    const precision = this.step.toString().replace(/\d*\.?/, '').length

    return {
      precision,
      resizeCursor: true,
      clicking: false,
      lastPosition: null,
      innerValue: this.value
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
      } else {
        units = this.units
      }

      if (this.hasAuto) {
        return ['auto', ...units]
      } else {
        return units
      }
    },
    match() {
      if (this.isInvalid(this.innerValue)) {
        return ['', '']
      } else {
        // eslint-disable-next-line
        const [_, unit] =
          this.innerValue.toString().match(/-?[.\d]+(.+)?/) || []
        return [parseFloat(this.innerValue), unit]
      }
    },
    number: {
      get() {
        return toPrecision(this.match[0], this.precision)
      },
      set(number) {
        let result

        if (this.isInvalid(number)) {
          result = null
        } else {
          result = toPrecision(number, this.precision) + this.unit
        }

        this.innerValue = result
      }
    },
    unit: {
      get() {
        if (this.isStringUnit) {
          return this.units
        }

        const { length } = this.units
        if (length === 1) {
          return this.units[0]
        } else if (length === 0) {
          return ''
        } else {
          return this.match[1] || this.units[0]
        }
      },
      set(unit) {
        const number = unit === 'auto' ? '' : this.number || '0'
        this.innerValue = number + unit
      }
    },
    isAuto() {
      return this.unit === 'auto'
    }
  },
  watch: {
    innerValue(newValue) {
      this.$emit('input', newValue)
    },
    value(value) {
      this.innerValue = value
    }
  },
  created() {
    document.addEventListener('mousemove', this.handleMousemove)
    document.addEventListener('mouseup', this.releaseClick)
  },
  beforeDestroy() {
    document.removeEventListener('mousemove', this.handleMousemove)
    document.removeEventListener('mouseup', this.releaseClick)
  },
  methods: {
    releaseClick() {
      this.clicking = false
    },
    handleMousemove(e) {
      if (!this.clicking) {
        return
      }
      const viewportOffset = this.$el.getBoundingClientRect()
      let value
      if (!this.lastPosition) {
        value = e.clientY <= viewportOffset.top ? this.step : -1 * this.step
      } else {
        value = this.lastPosition >= e.clientY ? this.step : -1 * this.step
      }

      if (
        this.number + value < this.min ||
        this.number + value > this.max
      ) {
        return
      }

      this.number += value
      this.lastPosition = e.clientY
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
