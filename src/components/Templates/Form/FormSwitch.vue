<template>
  <form-item
    :style="innerStyles"
    v-model="api"
    :rule="[keepSameObject]"
    :option="option" />
</template>

<script>
import clone from 'clone'
import { assignSet } from '../../../utils/tool'
import commonMixin from '../../../mixins/common'
import formItemMixin from '../../../mixins/formItem'
import { defaultSetting } from '../../../settings/formItem/formSwitch'

export default {
  defaultSetting,
  type: 'switch',
  name: 'FormSwitch',
  mixins: [commonMixin, formItemMixin],
  data() {
    // to solve a element-ui bug comes from the object reference different
    return {
      keepSameObject: {}
    }
  },
  watch: {
    innerRule: {
      handler(_rule) {
        const rule = clone(_rule[0])
        assignSet(this.keepSameObject, rule)
        this.keepSameObject.props.activeValue = rule.props.activeText
        this.keepSameObject.props.inactiveValue = rule.props.inactiveValue
      },
      immediate: true
    }
  }
}
</script>
