<template>
  <label for=""/>
</template>

<script>
import nodeMixin from '@/components/Templates/mixins/node'
import formItemMixin from '@/components/Templates/mixins/formItem'
import { defaultSetting } from '../Setup/EditorSetting/SettingFormInput'

export default {
  defaultSetting,
  name: 'FormLabel',
  mixins: [nodeMixin, formItemMixin]
}
</script>
