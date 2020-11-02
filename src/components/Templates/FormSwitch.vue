<template>
  <form-item

    v-model="api"
    :rule="[keepSameObject]"
    :option="option"
  />
</template>

<script>
import { cloneJson } from '@/utils/tool'
import propsMixin from '@/components/Templates/mixins/props'
import formItemMixin from '@/components/Templates/mixins/formItem'
import { defaultSetting } from '../Setup/EditorSetting/SettingFormSwitch'

export default {
  defaultSetting,
  type: 'switch',
  name: 'FormSwitch',
  mixins: [propsMixin, formItemMixin],
  data() {
    // to solve a element-ui bug comes from the object reference different
    return {
      keepSameObject: {}
    }
  },
  watch: {
    innerRule: {
      handler(_rule) {
        const rule = cloneJson(_rule[0])
        this.keepSameObject = Object.assign(this.keepSameObject, rule)
        // if (this.keepSameObject.props) {
        //   this.keepSameObject.props.activeValue = rule.props.activeText
        //   this.keepSameObject.props.inactiveValue = rule.props.inactiveValue
        // } else {
        //   this.keepSameObject.props = {
        //     activeValue: rule.props.activeValue,
        //     inactiveValue: rule.props.inactiveValue
        //   }
        // }
      },
      immediate: true
    }
  }
}
</script>
