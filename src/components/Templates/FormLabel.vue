<template>
  <label for=""/>
</template>

<script>
import nodeMixin from './mixins/node'
import formItemMixin from './mixins/formItem'
import { defaultSetting } from '../Setup/EditorSetting/FormInput'

export default {
  defaultSetting,
  name: 'FormLabel',
  mixins: [nodeMixin, formItemMixin]
}
</script>
