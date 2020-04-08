<template>
  <form-item
    :style="innerStyles"
    v-model="api"
    :rule="innerRule2"
    :option="option"
  />
</template>

<script>
import clone from 'clone'
import nodeMixin from '../../../mixins/node'
import formItemMixin from '../../../mixins/formItem'
import { defaultSetting } from '../../../settings/formItem/formRate'

export default {
  defaultSetting,
  type: 'rate',
  name: 'FormRate',
  mixins: [nodeMixin, formItemMixin],
  computed: {
    innerRule2() {
      const rule = clone(this.innerRule[0])
      rule.props.colors = [
        rule.props.lowColor,
        rule.props.midColor,
        rule.props.highColor
      ]
      return [rule]
    }
  }
}
</script>
