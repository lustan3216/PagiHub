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
import nodeMixin from '../../../mixins/node'
import formItemMixin from '../../../mixins/formItem'
import { defaultSetting } from '../../../settings/formItem/formInput'

export default {
  defaultSetting,
  type: 'InputNumber',
  name: 'FormNumber',
  mixins: [nodeMixin, formItemMixin]
}
</script>
