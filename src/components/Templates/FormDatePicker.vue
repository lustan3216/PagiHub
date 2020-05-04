<template>
  <form-item
    :style="innerStyles.default"
    v-model="api"
    :rule="innerRule"
    :option="option"
  />
</template>

<script>
import nodeMixin from '@/components/Templates/mixins/node'
import formItemMixin from '@/components/Templates/mixins/formItem'
import { defaultSetting } from '../Setup/EditorSetting/SettingFormDatePicker'

export default {
  defaultSetting,
  type: 'DatePicker',
  name: 'FormDatePicker',
  mixins: [nodeMixin, formItemMixin]
}
</script>

<style scoped>
::v-deep .el-date-editor {
  width: 100%;
}
</style>
