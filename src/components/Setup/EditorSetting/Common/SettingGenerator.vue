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
import { mapGetters } from 'vuex'
import { vm } from '@/utils/vmMap'
import { Switch, Tooltip, InputNumber } from 'element-ui'
import { cloneJson, getValueByPath } from '@/utils/tool'
import { mapMutations } from 'vuex'
import { PROPS } from '@/const'

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
    spec: {
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
      innerRules = cloneJson(this.spec)
      innerRules.forEach(spec => {
        const vmProps = vm(this.id).innerProps
        const path = spec.path ? `${spec.path}.${spec.field}` : `${spec.field}`
        spec.value = getValueByPath(vmProps, path, spec.value)
        spec.on = { change: value => this.updateRecord(spec, value) }
      })
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
    ...mapGetters('app', ['selectedComponentNode']),
    canShowSetting() {
      return Object.hasAnyKey(this.innerRules)
    }
  },
  methods: {
    ...mapMutations('draft', ['RECORD']),
    updateRecord(spec, value) {
      // if (key === 'options') {
      //   value = Array.uniq(value)
      //   this.api.updateRule(key, { value })
      // }
      this.api.setValue(spec.field, value)

      const path = spec.path
        ? `${this.id}.${PROPS}.${spec.path}.${spec.field}`
        : `${this.id}.${PROPS}.${spec.field}`

      this.RECORD([{ path, value }])
    }
  }
}
</script>
