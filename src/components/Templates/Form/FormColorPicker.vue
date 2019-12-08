<template>
  <form-item v-model="api" :rule="innerRule"  :option="option" />
</template>

<script>
import commonMixin from '../../../mixins/common'
import formItemMixin from '../../../mixins/formItem'
import { defaultSetting } from '../../../settings/formItem/formColorPicker'

export default {
  defaultSetting,
  type: 'ColorPicker',
  name: 'FormColorPicker',
  mixins: [commonMixin, formItemMixin]
}
</script>
