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
        @input="emit({ unit: $event })"
      />
    </el-col>

    <el-col :span="10">
      <style-select
        :value="innerValue[1]"
        @input="emit({ style: $event })"
      />
    </el-col>

    <el-col :span="3">
      <el-color-picker
        :value="innerValue[2]"
        show-alpha
        style="margin-top: 1px;"
        @input="emit({ color: $event })"
      />
    </el-col>
  </el-row>
</template>

<script>
import { ColorPicker } from 'element-ui'
import { capitalize } from '@/utils/string'
import SelectUnit from '@/components/Components/SelectUnit'

const REGEX = / (?=\D)/
const StyleSelect = {
  name: 'StyleSelect',
  functional: true,
  render(h, context) {
    const { data, props } = context
    const options = ['dashed', 'dotted', 'solid'].map((option, index) =>
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
    ElColorPicker: ColorPicker
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
    emit({ unit, style = 'solid', color = '#000' }) {
      if (unit && parseInt(unit)) {
        this.$emit('input', [unit, style, color].join(' '))
      }
      else {
        this.$emit('input', '')
      }
    }
  }
}
</script>
