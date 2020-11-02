<template>
  <form-item

    v-model="api"
    :id="id"
    :rule="innerRule2"
    :option="option"
  />
</template>

<script>
import propsMixin from '@/components/Templates/mixins/props'
import formItemMixin from '@/components/Templates/mixins/formItem'
import { defaultSetting } from '../Setup/EditorSetting/SettingFormRadio'
import { cloneJson } from '@/utils/tool'

export default {
  defaultSetting,
  type: 'radio',
  name: 'FormRadio',
  mixins: [propsMixin, formItemMixin],
  computed: {
    innerRule2() {
      const rule = cloneJson(this.innerRule[0])
      const { button, options } = rule.props
      if (button) {
        options.forEach(option => {
          option.border = true
        })
      }

      return [rule]
    }
  }
}
</script>
