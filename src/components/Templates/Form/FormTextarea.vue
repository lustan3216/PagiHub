<template>
  <form-item
    :style="innerStyles"
    v-model="api"
    :id="id"
    :rule="innerRule"
    :option="option" />
</template>

<script>
import nodeMixin from '../../../mixins/node'
import formItemMixin from '../../../mixins/formItem'
import { defaultSetting } from '../../../settings/formItem/formTextarea'

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
