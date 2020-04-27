<template>
  <form-item
    :style="innerStyles"
    v-model="api"
    :id="id"
    :rule="innerRule2"
    :option="option"
  />
</template>

<script>
import nodeMixin from '@/components/Templates/mixins/node'
import formItemMixin from '@/components/Templates/mixins/formItem'
import { defaultSetting } from '../Setup/EditorSetting/SettingFormCheckbox'
import { cloneJson } from '@/utils/tool'

export default {
  defaultSetting,
  type: 'checkbox',
  name: 'FormCheckbox',
  mixins: [nodeMixin, formItemMixin],
  computed: {
    innerRule2() {
      const rule = cloneJson(this.innerRule[0])
      const { button } = rule.props
      if (button) {
        rule.props.type = 'button'
      } else {
        delete rule.props
      }
      return [rule]
    }
  }
}
</script>

<style scoped>
::v-deep [type='button'] {
  -webkit-appearance: initial;
}
</style>
