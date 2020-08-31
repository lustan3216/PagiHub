<template>
  <form-item

    v-model="api"
    :id="id"
    :rule="innerRule"
    :option="option"
  />
</template>

<script>
import nodeMixin from '@/components/Templates/mixins/node'
import formItemMixin from '@/components/Templates/mixins/formItem'
import { defaultSetting } from '../Setup/EditorSetting/SettingFormTextarea'

export default {
  defaultSetting,
  type: 'input',
  name: 'FormTextarea',
  mixins: [nodeMixin, formItemMixin]
}
</script>

<style scoped lang="scss">
::v-deep .el-input__count {
  background: transparent;
}

</style>
