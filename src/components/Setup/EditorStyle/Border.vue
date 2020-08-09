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
        v-model="innerValue[0]"
        :min="0"
      />
    </el-col>

    <el-col :span="10">
      <style-select
        :value.sync="innerValue[1]"
      />
    </el-col>

    <el-col :span="3">
      <el-color-picker
        v-model="innerValue[2]"
        show-alpha
        style="margin-top: 1px;"
      />
    </el-col>

  </el-row>
</template>

<script>
import { ColorPicker } from 'element-ui'
import SelectUnit from '@/components/Components/SelectUnit'
import FourAttrs from './Common/FourAttrs'
import { capitalize } from '@/utils/string'

const REGEX = /(?<!,) /
const StyleSelect = {
  name: 'StyleSelect',
  functional: true,
  render(h, context) {
    const { data, props } = context
    const options = ['none', 'dashed', 'dotted', 'solid'].map((option, index) =>
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
      [
        ...options,
        h('el-button', {
          props: {
            icon: props.icon,
            type: 'text'
          },
          slot: 'prefix'
        })
      ]
    )
  }
}

export default {
  name: 'Border',
  components: {
    SelectUnit,
    FourAttrs,
    ElColorPicker: ColorPicker,
    StyleSelect
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
  data() {
    return {
      isUniq: true,
      innerValue: this.value.split(REGEX)
    }
  },
  computed: {

  },
  watch: {
    innerValue(border) {
      console.log(border)
      this.$emit('change', border)
    }
  },
  methods: {

  }
}
</script>
