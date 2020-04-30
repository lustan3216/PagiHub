<template>
  <four-attrs
    :value="value"
    attr="borderWidth"
    @input="$emit('input', $event)"
  >
    <template #button>
      <el-button
        circle
        icon="el-icon-rank"
      />
    </template>

    <template #all="{ value }">
      <select-unit
        :value.sync="value.all"
        icon="el-icon-rank"
      />
    </template>

    <template #first="{ value }">
      <select-unit
        :value.sync="value.first"
        icon="el-icon-top"
      />
    </template>

    <template #second="{ value }">
      <select-unit
        :value.sync="value.third"
        icon="el-icon-bottom"
      />
    </template>

    <template #third="{ value }">
      <select-unit
        :value.sync="value.fourth"
        icon="el-icon-back"
      />
    </template>

    <template #fourth="{ value }">
      <select-unit
        :value.sync="value.second"
        icon="el-icon-bottom-right"
      />
    </template>
  </four-attrs>
</template>

<script>
import SelectUnit from '@/components/Components/SelectUnit'
import FourAttrs from './Common/FourAttrs'

export default {
  name: 'BorderWidth',
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
