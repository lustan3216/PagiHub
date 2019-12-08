<template>
  <div v-if="isFlat">
    <h3>{{ name }}</h3>
    <form-create
      ref="form"
      v-model="api"
      :rule="ruleAppendProps"
      :option="option"
    />
  </div>
  <div v-else>
    <div v-for="(object, key) in specs">
      <nested-settings
        :id="id"
        :settings="object"
        :name="key"
        :key="key" />
    </div>
  </div>
</template>

<script>
// import clone from 'clone'
import formCreate from '@form-create/element-ui'
import { vmMap } from '../../utils/vmMap'
import { isString } from '../../lodash'
import clone from 'clone'

export default {
  name: 'NestedSettings',
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
      default: 'Basic'
    }
  },
  data() {
    const vmProps = vmMap[this.id].innerProps

    const innerSpecs = clone(this.specs)
    const update = key => {
      innerSpecs[key].value = vmProps[key]
    }

    Object.keys(innerSpecs).forEach(key => update(key))

    return {
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
      return this.name === 'Basic'
    },
    vm() {
      return vmMap[this.id]
    },
    isFlat() {
      // 因為field對setting來說是必填，用來測試是不是有疊層或是只有一層
      const firstValue = Object.firstValue(this.innerSpecs)
      return isString(firstValue.field)
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
