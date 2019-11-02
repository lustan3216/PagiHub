<template>
  <el-input
    v-bind="$attrs"
    :disabled="isAuto"
    v-model="number"
    type="number"
    clearable>
    <div slot="append">{{ unit || '-' }}</div>
  </el-input>
</template>

<script>
export default {
  name: 'InputUnit',
  props: {
    auto: {
      type: Boolean,
      default: false
    },
    allowNegative: {
      type: Boolean,
      default: false
    },
    unit: {
      type: String,
      default: ''
    },
    value: {
      default: null
    }
  },
  computed: {
    match() {
      if (this.isInvalid(this.value)) {
        return ['', this.unit]
      } else {
        return [parseInt(this.value), this.unit]
      }
    },
    number: {
      get() {
        return this.match[0]
      },
      set(value) {
        if (this.isInvalid(value)) {
          this.$emit('update:value', null)
        } else {
          this.$emit('update:value', value + this.unit)
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
