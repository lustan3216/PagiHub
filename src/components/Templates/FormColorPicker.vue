<template>
  <form-item
    :style="innerStyles"
    v-model="api"
    :rule="innerRule"
    :option="option"
  />
</template>

<script>
import nodeMixin from './mixins/node'
import formItemMixin from './mixins/formItem'
import { defaultSetting } from '../Setup/EditorSetting/SettingFormColorPicker'

export default {
  defaultSetting,
  type: 'ColorPicker',
  name: 'FormColorPicker',
  mixins: [nodeMixin, formItemMixin]
}
</script>
