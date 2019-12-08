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
import { defaultSetting } from '../../../settings/formItem/formInput'

export default {
  defaultSetting,
  type: 'input',
  name: 'FormInput',
  mixins: [commonMixin, formItemMixin]
}
</script>
