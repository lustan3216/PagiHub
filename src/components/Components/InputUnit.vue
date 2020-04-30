<template>
  <el-input
    :disabled="isAuto"
    v-model="number"
    type="number"
    clearable
    v-bind="$attrs"
  >
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
      validator() {
        return true
      },
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
          this.$emit('input', null)
          this.$emit('update:value', null)
        } else {
          this.$emit('input', value + this.unit)
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
    padding: 0;
  }
  .el-input.is-disabled .el-input-group__append .el-input__inner {
    cursor: inherit;
  }
}
</style>
