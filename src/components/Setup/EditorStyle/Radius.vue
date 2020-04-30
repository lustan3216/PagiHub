<template>
  <four-attrs
    :value="value"
    attr="borderRadius"
    title="radius"
    @input="$emit('input', $event)"
  >
    <template #button>
      <el-button
        circle
        icon="el-icon-full-screen"
      />
    </template>

    <template #all="{ value }">
      <select-unit
        :value.sync="value.all"
        icon="el-icon-full-screen"
      />
    </template>

    <template #first="{ value }">
      <select-unit
        :value.sync="value.first"
        icon="el-icon-top-left"
      />
    </template>

    <template #second="{ value }">
      <select-unit
        :value.sync="value.second"
        icon="el-icon-top-right"
      />
    </template>

    <template #third="{ value }">
      <select-unit
        :value.sync="value.fourth"
        icon="el-icon-bottom-left"
      />
    </template>

    <template #fourth="{ value }">
      <select-unit
        :value.sync="value.third"
        icon="el-icon-bottom-right"
      />
    </template>
  </four-attrs>
</template>

<script>
import SelectUnit from '@/components/Components/SelectUnit'
import FourAttrs from './Common/FourAttrs'

export default {
  name: 'Radius',
  components: {
    SelectUnit,
    FourAttrs
  },
  props: {
    value: {
      type: String,
      required: true
    }
  }
}
</script>
