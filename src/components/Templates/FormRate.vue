<template>
  <form-item
    :style="innerStyles"
    v-model="api"
    :rule="innerRule2"
    :option="option"
  />
</template>

<script>
import { cloneJson } from '@/utils/tool'
import nodeMixin from '@/components/Templates/mixins/node'
import formItemMixin from '@/components/Templates/mixins/formItem'
import { defaultSetting } from '../Setup/EditorSetting/SettingFormRate'

export default {
  defaultSetting,
  type: 'rate',
  name: 'FormRate',
  mixins: [nodeMixin, formItemMixin],
  computed: {
    innerRule2() {
      const rule = cloneJson(this.innerRule[0])
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
