<template>
  <four-attrs
    v-model="innerValue"
    attr="padding"
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
        :min="0"
        prefix-icon="el-icon-rank"
      />
    </template>

    <template #first="{ value }">
      <select-unit
        v-model="value.first"
        :min="0"
        prefix-icon="el-icon-top"
      />
    </template>

    <template #second="{ value }">
      <select-unit
        v-model="value.third"
        :min="0"
        prefix-icon="el-icon-bottom"
      />
    </template>

    <template #third="{ value }">
      <select-unit
        v-model="value.fourth"
        :min="0"
        prefix-icon="el-icon-back"
      />
    </template>

    <template #fourth="{ value }">
      <select-unit
        v-model="value.second"
        :min="0"
        prefix-icon="el-icon-bottom-right"
      />
    </template>
  </four-attrs>
</template>

<script>
import SelectUnit from '@/components/Components/SelectUnit'
import FourAttrs from './Common/FourAttrs'

export default {
  name: 'Padding',
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
    innerValue(padding) {
      this.$emit('change', { padding })
    }
  }
}
</script>
