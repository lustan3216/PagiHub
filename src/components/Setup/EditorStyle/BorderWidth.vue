<template>
  <four-attrs
    v-model="innerValue"
    attr="borderWidth"
  >
    <template #button>
      <el-button
        circle
        icon="el-icon-rank"
      />
    </template>

    <template #all="{ value }">
      <select-unit
        v-model="value.all"
        prefix-icon="el-icon-rank"
      />
    </template>

    <template #first="{ value }">
      <select-unit
        v-model="value.first"
        prefix-icon="el-icon-top"
      />
    </template>

    <template #second="{ value }">
      <select-unit
        v-model="value.third"
        prefix-icon="el-icon-bottom"
      />
    </template>

    <template #third="{ value }">
      <select-unit
        v-model="value.fourth"
        prefix-icon="el-icon-back"
      />
    </template>

    <template #fourth="{ value }">
      <select-unit
        v-model="value.second"
        prefix-icon="el-icon-bottom-right"
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
  },
  data() {
    return {
      innerValue: this.value
    }
  },
  watch: {
    innerValue(borderWidth) {
      this.$emit('change', { borderWidth })
    }
  }
}
</script>
