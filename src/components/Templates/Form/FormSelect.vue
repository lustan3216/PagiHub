<template>
  <form-item
    :style="innerStyles"
    v-model="api"
    :id="id"
    :rule="innerRule"
    :option="option" />
</template>

<script>
import commonMixin from '../../../mixins/common'
import formItemMixin from '../../../mixins/formItem'
import { defaultSetting } from '../../../settings/formItem/formSelect'

export default {
  defaultSetting,
  type: 'select',
  name: 'FormSelect',
  mixins: [commonMixin, formItemMixin]
}
</script>
