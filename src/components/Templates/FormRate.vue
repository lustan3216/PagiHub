<template>
  <form-item

    v-model="api"
    :rule="innerRule2"
    :option="option"
  />
</template>

<script>
import { cloneJson } from '@/utils/tool'
import propsMixin from '@/components/Templates/mixins/props'
import formItemMixin from '@/components/Templates/mixins/formItem'
import { defaultSetting } from '../Setup/EditorSetting/SettingFormRate'

export default {
  defaultSetting,
  type: 'rate',
  name: 'FormRate',
  mixins: [propsMixin, formItemMixin],
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
