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

  <el-input
    v-else
    ref="input"
    v-model="number"
    :class="{ 'ns-resize': resizeCursor }"
    :prefix-icon="prefixIcon"
    type="number"
    class="number"
    clearable
    @mousedown.native="clicking = true"
    @focus="resizeCursor= false"
    @blur="resizeCursor = true"
    @change="$emit('change', innerValue)"
  >
    <el-dropdown
      slot="append"
      :style="{
        cursor: optionUnits.length >= 2 ? 'pointer' : 'none'
      }"
      size="small"
      @command="unit = $event"
    >
      <span class="title">
        {{ unit.toUpperCase() || '-' }}
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="unit in optionUnits"
          :key="unit"
          :command="unit"
          class="sub-title"
        >
          {{ unit.toUpperCase() }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-input>
</template>

<script>
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
      default: Infinity
    },
    max: {
      type: Number,
      default: Infinity
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
    return {
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
        return this.match[0]
      },
      set(number) {
        let result

        if (this.isInvalid(number)) {
          result = null
        } else {
          result = number + this.unit
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
        value = e.clientY <= viewportOffset.top ? 1 : -1
      } else {
        value = this.lastPosition >= e.clientY ? 1 : -1
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
