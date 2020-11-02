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
import { defaultSetting } from '../Setup/EditorSetting/SettingFormSelect'

export default {
  defaultSetting,
  type: 'select',
  name: 'FormSelect',
  mixins: [propsMixin, formItemMixin]
}
</script>
