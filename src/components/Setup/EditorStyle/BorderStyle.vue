<template>
  <four-attrs
    v-model="innerValue"
    attr="borderStyle"
  >
    <template #button>
      <el-button
        circle
        icon="el-icon-rank"
      />
    </template>

    <template #all="{ value }">
      <style-select
        :value.sync="value.all"
        icon="el-icon-rank"
      />
    </template>

    <template #first="{ value }">
      <style-select
        :value.sync="value.first"
        icon="el-icon-top"
      />
    </template>

    <template #second="{ value }">
      <style-select
        :value.sync="value.third"
        icon="el-icon-bottom"
      />
    </template>

    <template #third="{ value }">
      <style-select
        :value.sync="value.fourth"
        icon="el-icon-back"
      />
    </template>

    <template #fourth="{ value }">
      <style-select
        :value.sync="value.second"
        icon="el-icon-right"
      />
    </template>
  </four-attrs>
</template>

<script>
import SelectUnit from '@/components/Components/SelectUnit'
import FourAttrs from './Common/FourAttrs'
import { capitalize } from '@/utils/string'

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
          input: value => data.on['update:value'](value)
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
  name: 'BorderStyle',
  components: {
    SelectUnit,
    FourAttrs,
    StyleSelect
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      innerValue: this.value
    }
  },
  watch: {
    innerValue(borderStyle) {
      this.$emit('change', { borderStyle })
    }
  }
}
</script>
