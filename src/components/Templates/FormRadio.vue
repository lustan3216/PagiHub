<template>
  <form-item
    :style="innerStyles"
    v-model="api"
    :id="id"
    :rule="innerRule"
    :option="option"
  />
</template>

<script>
import nodeMixin from '@/components/Templates/mixins/node'
import formItemMixin from '@/components/Templates/mixins/formItem'
import { defaultSetting } from '../Setup/EditorSetting/SettingFormRadio'

export default {
  defaultSetting,
  type: 'radio',
  name: 'FormRadio',
  mixins: [nodeMixin, formItemMixin]
}
</script>
