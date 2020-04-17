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
import clone from 'clone'
import nodeMixin from './mixins/node'
import formItemMixin from './mixins/formItem'
import { defaultSetting } from '../Setup/EditorSetting/FormCheckbox'

export default {
  defaultSetting,
  type: 'checkbox',
  name: 'FormCheckbox',
  mixins: [nodeMixin, formItemMixin],
  computed: {
    innerRule2() {
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
