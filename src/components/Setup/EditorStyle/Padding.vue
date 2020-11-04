<template>
  <four-attrs
    v-model="padding"
    title="padding"
    empty-value="0"
  >
    <template #button>
      <el-button icon="el-icon-rank" />
    </template>

    <template #all="{ all, emitAll }">
      <select-unit
        :value="all"
        :min="0"
        prefix-icon="el-icon-rank"
        @input="emitAll($event)"
        @clear="emitAll(undefined)"
      />
    </template>

    <template #first="{ four, emitFour }">
      <select-unit
        :value="four.first"
        :min="0"
        prefix-icon="el-icon-top"
        @input="emitFour({ ...four, first: $event })"
        @clear="emitFour({ ...four, first: undefined })"
      />
    </template>

    <template #second="{ four, emitFour }">
      <select-unit
        :value="four.third"
        :min="0"
        prefix-icon="el-icon-bottom"
        @input="emitFour({ ...four, third: $event })"
        @clear="emitFour({ ...four, third: undefined })"
      />
    </template>

    <template #third="{ four, emitFour }">
      <select-unit
        :value="four.fourth"
        :min="0"
        prefix-icon="el-icon-back"
        @input="emitFour({ ...four, fourth: $event })"
        @clear="emitFour({ ...four, fourth: undefined })"
      />
    </template>

    <template #fourth="{ four, emitFour }">
      <select-unit
        :value="four.second"
        :min="0"
        prefix-icon="el-icon-right"
        @input="emitFour({ ...four, second: $event })"
        @clear="emitFour({ ...four, second: undefined })"
      />
    </template>
  </four-attrs>
</template>

<script>
import SelectUnit from '@/components/Components/SelectUnit'
import FourAttrs from './Common/FourAttrs'
import forNodeMixin from './mixins/forNode'

export default {
  name: 'Padding',
  components: {
    SelectUnit,
    FourAttrs
  },
  mixins: [forNodeMixin('padding')]
}
</script>
