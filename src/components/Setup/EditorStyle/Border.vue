<template>
  <el-row
    :gutter="5"
    type="flex"
    align="middle"
    style="margin-top: -5px;"
  >
    <el-col :span="11">
      <select-unit
        :prefix-icon="icon"
        :value="innerValue[0]"
        :min="0"
        @input="emit($event, innerValue[1], innerValue[2])"
      />
    </el-col>

    <el-col :span="10">
      <style-select
        :value="innerValue[1]"
        @input="emit(innerValue[0], $event, innerValue[2])"
      />
    </el-col>

    <el-col :span="3">
      <color-picker
        :value="innerValue[2]"
        style="margin-top: 1px;"
        @input="emit(innerValue[0], innerValue[1], $event)"
      />
    </el-col>
  </el-row>
</template>

<script>
import ColorPicker from '@/components/Components/ColorPicker'
import { capitalize } from '@/utils/string'
import SelectUnit from '@/components/Components/SelectUnit'

const REGEX = / (?=\D)/
const StyleSelect = {
  name: 'StyleSelect',
  functional: true,
  render(h, context) {
    const { data, props } = context
    const options = [
      'inset',
      'outset',
      'dashed',
      'dotted',
      'solid',
      'double',
      'groove',
      'ridge'
    ].map((option, index) =>
      h('el-option', {
        key: index,
        props: {
          value: option,
          label: capitalize(option)
        }
      })
    )

    return h(
      'el-select',
      {
        on: {
          input: value => data.on['input'](value)
        },
        props
      },
      options
    )
  }
}

export default {
  name: 'Border',
  components: {
    SelectUnit,
    StyleSelect,
    ColorPicker
  },
  props: {
    value: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    }
  },
  computed: {
    innerValue() {
      return this.value.split(REGEX)
    }
  },
  methods: {
    emit(unit, style = 'solid', color) {
      if (unit === null) {
        return this.$emit('input', '')
      }

      this.$emit('input', [unit || '1px', style, color].join(' '))
    }
  }
}
</script>
