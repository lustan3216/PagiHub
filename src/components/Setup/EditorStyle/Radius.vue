<template>
  <four-attrs
    v-model="innerValue"
    attr="borderRadius"
    title="radius"
  >
    <template #button>
      <el-button
        icon="el-icon-full-screen"
      />
    </template>

    <template #all="{ value }">
      <select-unit
        v-model="value.all"
        prefix-icon="el-icon-full-screen"
      />
    </template>

    <template #first="{ value }">
      <select-unit
        v-model="value.first"
        prefix-icon="el-icon-top-left"
      />
    </template>

    <template #second="{ value }">
      <select-unit
        v-model="value.second"
        prefix-icon="el-icon-top-right"
      />
    </template>

    <template #third="{ value }">
      <select-unit
        v-model="value.fourth"
        prefix-icon="el-icon-bottom-left"
      />
    </template>

    <template #fourth="{ value }">
      <select-unit
        v-model="value.third"
        prefix-icon="el-icon-bottom-right"
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
  },
  data() {
    return {
      innerValue: this.value
    }
  },
  watch: {
    innerValue(borderRadius) {
      this.$emit('change', { borderRadius })
    }
  }
}
</script>
