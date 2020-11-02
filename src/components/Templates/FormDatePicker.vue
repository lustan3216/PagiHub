<template>
  <form-item

    v-model="api"
    :rule="innerRule"
    :option="option"
  />
</template>

<script>
import propsMixin from '@/components/Templates/mixins/props'
import formItemMixin from '@/components/Templates/mixins/formItem'
import { defaultSetting } from '../Setup/EditorSetting/SettingFormDatePicker'

export default {
  defaultSetting,
  type: 'DatePicker',
  name: 'FormDatePicker',
  mixins: [propsMixin, formItemMixin]
}
</script>

<style scoped>
::v-deep .el-date-editor {
  width: 100%;
}
</style>
