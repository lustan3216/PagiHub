<template>
  <form-item
    :style="innerStyles"
    v-model="api"
    :id="id"
    :rule="_innerRule"
    :option="option"
  />
</template>

<script>
import clone from 'clone'
import nodeMixin from '@/components/Templates/mixins/node'
import formItemMixin from '@/components/Templates/mixins/formItem'
import { defaultSetting } from '../Setup/EditorSetting/SettingFormCheckbox'

export default {
  defaultSetting,
  type: 'checkbox',
  name: 'FormCheckbox',
  mixins: [nodeMixin, formItemMixin],
  computed: {
    _innerRule() {
      const rule = clone(this.innerRule[0])
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
