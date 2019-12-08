<template>
  <form-item
    v-model="api"
    :id="id"
    :rule="innerRule2"
    :option="option" />
</template>

<script>
import clone from 'clone'
import commonMixin from '../../../mixins/common'
import formItemMixin from '../../../mixins/formItem'
import { defaultSetting } from '../../../settings/formItem/formCheckbox'

export default {
  defaultSetting,
  type: 'checkbox',
  name: 'FormCheckbox',
  mixins: [commonMixin, formItemMixin],
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
