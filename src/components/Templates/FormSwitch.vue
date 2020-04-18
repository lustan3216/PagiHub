<template>
  <form-item
    :style="innerStyles"
    v-model="api"
    :rule="[keepSameObject]"
    :option="option"
  />
</template>

<script>
import clone from 'clone'
import { merge } from '../../utils/tool'
import nodeMixin from './mixins/node'
import formItemMixin from './mixins/formItem'
import { defaultSetting } from '../Setup/EditorSetting/SettingFormSwitch'

export default {
  defaultSetting,
  type: 'switch',
  name: 'FormSwitch',
  mixins: [nodeMixin, formItemMixin],
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
        merge(this.keepSameObject, rule)
        this.keepSameObject.props.activeValue = rule.props.activeText
        this.keepSameObject.props.inactiveValue = rule.props.inactiveValue
      },
      immediate: true
    }
  }
}
</script>
