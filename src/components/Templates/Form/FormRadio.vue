<template>
  <form-item
    v-model="api"
    :id="id"
    :rule="innerRule"
    :option="option" />
</template>

<script>
import commonMixin from '../../../mixins/common'
import formItemMixin from '../../../mixins/formItem'
import { defaultSetting } from '../../../settings/formItem/formRadio'

export default {
  defaultSetting,
  type: 'radio',
  name: 'FormRadio',
  mixins: [commonMixin, formItemMixin]
}
</script>
