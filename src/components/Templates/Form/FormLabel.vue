<template>
  <label for=""/>
</template>

<script>
import nodeMixin from '../../../mixins/node'
import formItemMixin from '../../../mixins/formItem'
import { defaultSetting } from '../../../settings/formItem/formInput'

export default {
  defaultSetting,
  name: 'FormLabel',
  mixins: [nodeMixin, formItemMixin]
}
</script>
