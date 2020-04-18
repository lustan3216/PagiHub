<template>
  <el-image
    v-bind="innerProps"
    :style="innerStyles"
    class="wh-100"
  />
</template>

<script>
import nodeMixin from './mixins/node'
import { defaultSetting } from '../Setup/EditorSetting/SettingFlexImage'

export default {
  defaultSetting,
  name: 'FlexImage',
  mixins: [nodeMixin]
}
</script>

<style lang="scss" scoped></style>
