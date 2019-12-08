<template>
  <form-item v-model="api" :rule="innerRule"  :option="option" />
</template>

<script>
  import commonMixin from '../../../mixins/common'
  import formItemMixin from '../../../mixins/formItem'
  import { defaultSetting } from '../../../settings/formItem/formTimePicker'
  
  export default {
    defaultSetting,
    type: 'TimePicker',
    name: 'FormTimePicker',
    mixins: [commonMixin, formItemMixin]
  }
</script>

<style scoped>
  ::v-deep .el-date-editor{
    width: 100%;
  }
</style>
