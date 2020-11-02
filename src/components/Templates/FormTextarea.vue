<template>
  <form-item

    v-model="api"
    :id="id"
    :rule="innerRule"
    :option="option"
  />
</template>

<script>
import propsMixin from '@/components/Templates/mixins/props'
import formItemMixin from '@/components/Templates/mixins/formItem'
import { defaultSetting } from '../Setup/EditorSetting/SettingFormTextarea'

export default {
  defaultSetting,
  type: 'input',
  name: 'FormTextarea',
  mixins: [propsMixin, formItemMixin]
}
</script>

<style scoped lang="scss">
::v-deep .el-input__count {
  background: transparent;
}

</style>
