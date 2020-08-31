<template>
  <form-item

    v-model="api"
    :rule="innerRule"
    :option="option"
  />
</template>

<script>
import nodeMixin from '@/components/Templates/mixins/node'
import formItemMixin from '@/components/Templates/mixins/formItem'
import { defaultSetting } from '../Setup/EditorSetting/SettingFormColorPicker'

export default {
  defaultSetting,
  type: 'ColorPicker',
  name: 'FormColorPicker',
  mixins: [nodeMixin, formItemMixin]
}
</script>
