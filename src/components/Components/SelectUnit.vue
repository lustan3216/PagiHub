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
    v-bind="{ clearable: true, prefixIcon, ...$attrs, ...$props }"
    type="number"
    class="number"
    @change="$emit('change', innerValue)"
  >
    <el-select
      v-if="optionUnits.length >= 2"
      slot="append"
      v-model="unit"
      placeholder="-"
    >
      <el-option
        v-for="unit in optionUnits"
        :key="unit"
        :value="unit"
      />
    </el-select>
    <span
      v-else
      slot="append"
    >
      {{ unit || '-' }}
    </span>
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
    }
  },
  methods: {
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
  &:not(.el-input--prefix) > .el-input__inner[type='number'] {
    padding-right: 8px;
    padding-left: 8px;
  }

  .el-input-group__append,
  .el-input-group__prepend {
    width: 30px;
  }
  .el-input.is-disabled .el-input-group__append .el-input__inner {
    cursor: inherit;
  }

  .el-input-group__append {
    padding: 0 5px;

    .el-input__inner {
      padding-right: 0;
      padding-left: 12px;
    }
  }

  .el-select {
    width: 56px;
  }
}
</style>
