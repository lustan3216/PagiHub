<template>
  <four-attrs
    v-model="borderRadius"
    title="radius"
    empty-value="0"
  >
    <template #button>
      <el-button icon="el-icon-full-screen" />
    </template>

    <template #all="{ all, emitAll }">
      <select-unit
        :value="all"
        prefix-icon="el-icon-full-screen"
        @input="emitAll($event)"
      />
    </template>

    <template #first="{ four, emitFour }">
      <select-unit
        :value="four.first"
        prefix-icon="el-icon-top-left"
        @input="emitFour({ ...four, first: $event })"
      />
    </template>

    <template #second="{ four, emitFour }">
      <select-unit
        :value="four.second"
        prefix-icon="el-icon-top-right"
        @input="emitFour({ ...four, second: $event })"
      />
    </template>

    <template #third="{ four, emitFour }">
      <select-unit
        :value="four.fourth"
        prefix-icon="el-icon-bottom-left"
        @input="emitFour({ ...four, fourth: $event })"
      />
    </template>

    <template #fourth="{ four, emitFour }">
      <select-unit
        :value="four.third"
        prefix-icon="el-icon-bottom-right"
        @input="emitFour({ ...four, third: $event })"
      />
    </template>
  </four-attrs>
</template>

<script>
import SelectUnit from '@/components/Components/SelectUnit'
import FourAttrs from './Common/FourAttrs'
import forNodeMixin from './mixins/forNode'

export default {
  name: 'Radius',
  mixins: [forNodeMixin('borderRadius')],
  components: {
    SelectUnit,
    FourAttrs
  }
}
</script>
