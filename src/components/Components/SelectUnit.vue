<template>
  <el-select
    v-if="isAuto"
    v-model="unit"
  >
    <el-option
      v-for="unit in units"
      :key="unit"
      :value="unit"
    />
  </el-select>

  <el-input
    v-else
    ref="input"
    :prefix-icon="icon"
    v-model="number"
    type="number"
    clearable
    class="number"
  >
    <el-select
      slot="append"
      v-model="unit"
      placeholder="-"
    >
      <el-option
        v-for="unit in units"
        :key="unit"
        :value="unit"
      />
    </el-select>
  </el-input>
</template>

<script>
import { arraySubtract } from '@/utils/tool'
export default {
  name: 'SelectUnit',
  props: {
    icon: {
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
    exclude: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    units() {
      let units = ['px', '%', 'vh', 'vw']
      if (this.hasAuto) units.push('auto')
      if (this.exclude.length) {
        units = arraySubtract(units, this.exclude)
      }
      return units
    },
    match() {
      if (this.isInvalid(this.value)) {
        return ['', '']
      } else if (parseInt(this.value) === 0) {
        return ['0', 'px']
      } else {
        // eslint-disable-next-line
        const [_, number = '0', unit = 'px'] = this.value
          .toString()
          .match(/^(\d+)?([a-z|%]+)?/)
        return [number, unit]
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
        } else if (!this.unit) {
          result = number + 'px'
        } else {
          result = number + this.unit
        }

        this.$emit('update:value', result)
        this.$emit('change', result)
      }
    },
    unit: {
      get() {
        return this.match[1]
      },
      set(unit) {
        const number = unit === 'auto' ? '' : this.number || '0'
        this.$emit('update:value', number + unit)
        this.$emit('change', number + unit)
      }
    },
    isAuto() {
      return this.unit === 'auto'
    }
  },
  methods: {
    isInvalid(value) {
      return value === null || value === 'none' || value === ''
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
    padding: 0 10px;

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
