<template>
  <form-item

    v-model="api"
    :id="id"
    :rule="innerRule"
    :option="option"
  />
</template>

<script>
import propsMixin from '@/components/Templates/mixins/props'
import formItemMixin from '@/components/Templates/mixins/formItem'
import { defaultSetting } from '../Setup/EditorSetting/SettingFormInput'

export default {
  defaultSetting,
  type: 'input',
  name: 'FormInput',
  mixins: [propsMixin, formItemMixin]
}
</script>
