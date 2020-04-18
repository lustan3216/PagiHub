<template>
  <form-item
    :style="innerStyles"
    v-model="api"
    :rule="innerRule"
    :option="option"
  />
</template>

<script>
import nodeMixin from './mixins/node'
import formItemMixin from './mixins/formItem'
import { defaultSetting } from '../Setup/EditorSetting/SettingFormTimePicker'

export default {
  defaultSetting,
  type: 'TimePicker',
  name: 'FormTimePicker',
  mixins: [nodeMixin, formItemMixin]
}
</script>

<style scoped>
  ::v-deep .el-date-editor{
    width: 100%;
  }
</style>
