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
import { defaultSetting } from '../Setup/EditorSetting/SettingFormColorPicker'

export default {
  defaultSetting,
  type: 'ColorPicker',
  name: 'FormColorPicker',
  mixins: [propsMixin, formItemMixin]
}
</script>
