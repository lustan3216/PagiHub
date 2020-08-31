<template>
  <form-item

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
  type: 'InputNumber',
  name: 'FormNumber',
  mixins: [nodeMixin, formItemMixin]
}
</script>
