<template>
  <el-input
    :disabled="isAuto"
    v-model="number"
    type="number"
    clearable>
    <el-select
      slot="append"
      v-model="unit">
      <el-option
        label="px"
        value="px" />
      <el-option
        v-if="auto"
        label="auto"
        value="auto" />
      <el-option
        label="%"
        value="%" />
      <el-option
        label="vh"
        value="vh" />
      <el-option
        label="vw"
        value="vw" />
    </el-select>
  </el-input>
</template>

<script>
export default {
  name: 'SelectPx',
  props: {
    auto: {
      type: Boolean,
      default: false
    },
    allowNegative: {
      type: Boolean,
      default: false
    },
    value: {
      default: null
    }
  },
  computed: {
    match() {
      if (this.isInvalid(this.value)) {
        return ['', '']
      } else if (parseInt(this.value) === 0) {
        return ['0', 'px']
      } else {
        const [_, number = '0', unit = 'px'] = this.value.match(/^(\d+)?([a-z|%]+)?/)
        return [number, unit]
      }
    },
    number: {
      get() {
        return this.match[0]
      },
      set(value) {
        if (this.isInvalid(value)) {
          this.$emit('update:value', null)
        } else if (!this.unit) {
          this.$emit('update:value', value + 'px')
        } else {
          this.$emit('update:value', value + this.unit)
        }
      }
    },
    unit: {
      get() {
        return this.match[1]
      },
      set(value) {
        if (!this.number) {
          this.$emit('update:value', '0' + value)
        } else {
          this.$emit('update:value', this.number + value)
        }
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
  .el-input-group__append,
  .el-input-group__prepend {
    width: 35px;
  }
  .el-input.is-disabled .el-input-group__append .el-input__inner {
    cursor: inherit;
  }
}
</style>
