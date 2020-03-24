<template>
  <label for=""/>
</template>

<script>
import commonMixin from '../../../mixins/common'
import formItemMixin from '../../../mixins/formItem'
import { defaultSetting } from '../../../settings/formItem/formInput'
  
export default {
  defaultSetting,
  name: 'FormLabel',
  mixins: [commonMixin, formItemMixin]
}
</script>
