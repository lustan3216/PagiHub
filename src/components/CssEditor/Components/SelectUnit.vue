<template>
  <el-select v-if="isAuto" v-model="unit">
    <el-option v-for="unit in units" :label="unit" :value="unit" />
  </el-select>
  
  <el-input
    v-else
    v-model="number"
    type="number"
    size="mini"
    clearable
    class="number"
  >
    <el-select slot="append" v-model="unit" placeholder="-">
      <el-option v-for="unit in units" :label="unit" :value="unit" />
    </el-select>
  </el-input>
  
</template>

<script>
export default {
  name: 'SelectUnit',
  props: {
    hasAuto: {
      type: Boolean,
      default: false
    },
    allowNegative: {
      type: Boolean,
      default: false
    },
    value: {
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
        units = units.subtract(this.exclude)
      }
      return units
    },
    match() {
      if (this.isInvalid(this.value)) {
        return ['', '']
      } else if (parseInt(this.value) === 0) {
        return ['0', 'px']
      } else {
        const [_, number = '0', unit = 'px'] = this.value.toString().match(
          /^(\d+)?([a-z|%]+)?/
        )
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
      }
    },
    unit: {
      get() {
        return this.match[1]
      },
      set(unit) {
        const number = unit === 'auto' ? '' : this.number || '0'
        this.$emit('update:value', number + unit)
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
  .el-input__inner[type="number"] {
    padding-right: 10px;
    padding-left: 10px;
  }
  
  .el-input-group__append,
  .el-input-group__prepend {
    width: 25px;
  }
  .el-input.is-disabled .el-input-group__append .el-input__inner {
    cursor: inherit;
  }
}
</style>
