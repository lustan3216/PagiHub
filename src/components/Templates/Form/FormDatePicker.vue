<template>
  <form-item
    :style="innerStyles"
    v-model="api"
    :rule="innerRule"
    :option="option" />
</template>

<script>
import commonMixin from '../../../mixins/common'
import formItemMixin from '../../../mixins/formItem'
import { defaultSetting } from '../../../settings/formItem/formDatePicker'

export default {
  defaultSetting,
  type: 'DatePicker',
  name: 'FormDatePicker',
  mixins: [commonMixin, formItemMixin]
}
</script>

<style scoped>
::v-deep .el-date-editor {
  width: 100%;
}
</style>
