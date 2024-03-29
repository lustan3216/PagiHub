<template>
  <form-create
    ref="form"
    v-model="api"
    :rule="innerRules"
    :option="option"
    :key="id"
  />
</template>

<script>
import formCreate from '@form-create/element-ui'
import { Switch, Tooltip, InputNumber } from 'element-ui'
import { getValueByPath } from '@/utils/tool'
import { cloneObject } from '@/utils/object'
import { vmGet } from '@/utils/vmMap'
import { mapGetters, mapActions } from 'vuex'
import { PROPS } from '@/const'
import SelectUnit from '@/components/Components/SelectUnit'
import SliderPoints from '@/components/Components/SliderPoints'
import { traversalRules } from '../utils/ruleTool'

formCreate.component('SelectUnit', SelectUnit)
formCreate.component('SliderPoints', SliderPoints)
formCreate.component('ElSwitch', Switch)
formCreate.component('ElTooltip', Tooltip)
formCreate.component('ElInputNumber', InputNumber)

export default {
  name: 'RulesGenerator',
  components: {
    FormCreate: formCreate.$form()
  },
  props: {
    id: {
      type: String,
      required: true
    },
    rules: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      api: {},
      option: {
        form: { labelPosition: 'left', size: 'mini', labelWidth: '85px' },
        info: { type: 'tooltip' },
        submitBtn: { show: false }
      },
      innerRules: {}
    }
  },
  created() {
    let innerRules = {}

    innerRules = cloneObject(this.rules)
    traversalRules(innerRules, this.transformRule)

    this.innerRules = innerRules
  },
  computed: {
    ...mapGetters('app', ['selectedComponentNodes'])
  },
  methods: {
    ...mapActions('node', ['debounceRecord']),
    transformRule(rule) {
      const vmProps = vmGet(this.id).innerProps
      const path = rule.path ? `${rule.path}.${rule.field}` : `${rule.field}`

      defaultValueCache[rule.field] = rule.value
      rule.value = getValueByPath(vmProps, path, rule.value)

      if (this.isBooleanType(rule)) {
        rule.value = [rule.value]
      }

      rule.on = {
        change: value => this.updateRecord(rule, value)
      }
    },
    isBooleanType(rule) {
      return rule.type === 'checkbox'
    },
    updateRecord(rule, value) {
      this.api.setValue(rule.field, value)

      if (this.isBooleanType(rule)) {
        value = value[0] || false
      }

      // same as default, thus delete the setting
      if (defaultValueCache[rule.field] === value) {
        value = undefined
      }

      const records = []
      this.selectedComponentNodes.forEach(node => {
        const path = rule.path
          ? `${node.id}.${PROPS}.${rule.path}.${rule.field}`
          : `${node.id}.${PROPS}.${rule.field}`

        records.push({ path, value })
      })

      this.debounceRecord(records)
    }
  }
}

const defaultValueCache = {}
</script>
