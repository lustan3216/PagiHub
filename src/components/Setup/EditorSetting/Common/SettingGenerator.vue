<template>
  <form-create
    v-if="canShowSetting"
    ref="form"
    v-model="api"
    :rule="innerRules"
    :option="option"
  />
</template>

<script>
import formCreate from '@form-create/element-ui'
import { Switch, Tooltip, InputNumber } from 'element-ui'
import { cloneJson, getValueByPath } from '@/utils/tool'
import { vm } from '@/utils/vmMap'
import { mapMutations } from 'vuex'
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
  name: 'SettingGenerator',
  components: {
    FormCreate: formCreate.$form()
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    rules: {
      type: Array,
      required: true
    }
  },
  data() {
    let innerRules = {}
    const selectedComponentNode = this.$store.getters[
      'app/selectedComponentNode'
    ]

    if (selectedComponentNode) {
      innerRules = cloneJson(this.rules)
      traversalRules(innerRules, this.transformRule)
    }

    return {
      api: {},
      option: {
        form: { size: 'mini' },
        info: { type: 'tooltip' },
        submitBtn: { show: false }
      },
      innerRules
    }
  },
  computed: {
    canShowSetting() {
      return Object.hasAnyKey(this.innerRules)
    }
  },
  methods: {
    ...mapMutations('draft', ['RECORD']),
    transformRule(rule) {
      const vmProps = vm(this.id).innerProps
      const path = rule.path ? `${rule.path}.${rule.field}` : `${rule.field}`

      defaultValueCache[rule.field] = rule.value
      rule.value = getValueByPath(vmProps, path, rule.value)
      rule.on = { change: value => this.updateRecord(rule, value) }
    },
    updateRecord(rule, value) {
      this.api.setValue(rule.field, value)

      // same as default, thus delete the setting
      if (defaultValueCache[rule.field] === value) {
        value = undefined
      }

      const path = rule.path
        ? `${this.id}.${PROPS}.${rule.path}.${rule.field}`
        : `${this.id}.${PROPS}.${rule.field}`

      this.RECORD([{ path, value }])
    }
  }
}

const defaultValueCache = {}
</script>
