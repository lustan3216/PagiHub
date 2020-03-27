<template>
  <div v-if="isFlat">
    <span class="el-dropdown m-b-5 bold">{{ (name || 'Basic').toLocaleUpperCase() }}</span>
    <form-create
      ref="form"
      v-model="api"
      :rule="ruleAppendProps"
      :option="option"
    />
  </div>
  <div v-else>
    <div v-for="(object, key) in specs" :key="key">
      <nested-settings
        :id="id"
        :specs="object"
        :name="key"
        :key="key"
      />
    </div>
  </div>
</template>

<script>
import clone from 'clone'
import formCreate from '@form-create/element-ui'
import { vmMap } from '../../utils/vmMap'
import { isString } from '../../lodash'

export default {
  name: 'SettingsNested',
  components: {
    FormCreate: formCreate.$form()
  },
  props: {
    specs: {
      type: Object,
      required: true
    },
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    const vmProps = vmMap[this.id].innerProps
    const innerSpecs = clone(this.specs)
    const firstValue = Object.firstValue(this.specs)
    // 因為field對setting來說是必填，用來測試是不是有疊層或是只有一層
    const isFlat = isString(firstValue.field)

    if (isFlat) {
      const update = key => {
        innerSpecs[key].value = this.name
          ? vmProps[this.name][key]
          : vmProps[key]
      }
      Object.keys(innerSpecs).forEach(key => update(key))
    }

    return {
      isFlat,
      api: {},
      option: {
        form: { size: 'mini' },
        info: { type: 'tooltip' },
        submitBtn: { show: false }
      },
      innerSpecs
    }
  },
  computed: {
    isRoot() {
      return this.name === ''
    },
    vm() {
      return vmMap[this.id]
    },
    ruleAppendProps() {
      const rule = this.innerSpecs
      for (const [key, value] of Object.entries(rule)) {
        value.on = {
          change: value => {
            if (key === 'options') {
              value = Array.uniq(value)
              this.api.updateRule(key, { value })
            }

            let result = { [key]: value }
            if (!this.isRoot) result = { [this.name]: result }
            this.vm.setSetting(result)
          }
        }
      }

      return Object.values(rule)
    }
  }
}
</script>
