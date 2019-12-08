<template>
  <form-item v-model="api" :rule="innerRule"  :option="option" />
</template>

<script>
  import commonMixin from '../../../mixins/common'
  import formItemMixin from '../../../mixins/formItem'
  import { defaultSetting } from '../../../settings/formItem/formRate'
  
  export default {
    defaultSetting,
    type: 'rate',
    name: 'FormRate',
    mixins: [commonMixin, formItemMixin]
  }
</script>
