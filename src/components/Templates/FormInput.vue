<template>
  <form-item
    :style="innerStyles.default"
    v-model="api"
    :id="id"
    :rule="innerRule"
    :option="option"
  />
</template>

<script>
import nodeMixin from '@/components/Templates/mixins/node'
import formItemMixin from '@/components/Templates/mixins/formItem'
import { defaultSetting } from '../Setup/EditorSetting/SettingFormInput'

export default {
  defaultSetting,
  type: 'input',
  name: 'FormInput',
  mixins: [nodeMixin, formItemMixin]
}
</script>
