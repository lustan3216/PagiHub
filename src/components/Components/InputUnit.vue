<template>
  <el-input
    :disabled="isAuto"
    v-model="number"
    v-bind="{ clearable: true, ...$attrs, ...$props }"
    type="number"
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
        return null
      }
      else {
        // eslint-disable-next-line
        return parseFloat(this.value)
      }
    },
    number: {
      get() {
        return this.match
      },
      set(value) {
        if (this.isInvalid(value)) {
          this.$emit('input', null)
        }
        else {
          this.$emit('input', value + this.unit)
        }
      }
    },
    isAuto() {
      return this.unit === 'auto'
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
