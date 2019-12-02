<template>
  <div v-if="isFlat(settings)">
    <h3>{{ name }}</h3>
    <form-create :rule="ruleAppendProps(settings)" :option="option" />
  </div>
  <div v-else>
    <div v-for="(object, key) in settings">
      <nested-settings :id="id" :settings="object" :name="key" />
    </div>
  </div>
</template>

<script>
import formCreate from '@form-create/element-ui'
import { vmMap } from '../../utils/vmMap'
import { get } from '../../lodash'

export default {
  name: 'NestedSettings',
  components: {
    FormCreate: formCreate.$form()
  },
  props: {
    settings: {
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
    return {
      option: {
        form: { size: 'mini' },
        info: { type: 'tooltip' },
        submitBtn: { show: false }
      }
    }
  },
  computed: {
    isRoot() {
      return this.name === 'Basic'
    },
    vm() {
      return vmMap[this.id]
    },
    vmSettings() {
      return this.vm.innerSettings
    }
  },
  methods: {
    ruleAppendProps(rule) {
      for (const [key, value] of Object.entries(rule)) {
        const path = this.isRoot ? key : `${this.name}.${key}`
        value.value = get(this.vmSettings, path, value.value)

        value.on = {
          change: value => {
            let result = { [key]: value }
            if (!this.isRoot) result = { [this.name]: result }
            this.vm.setSetting(result)
          }
        }
      }

      return Object.values(rule)
    },
    isFlat(value) {
      // 因為field對setting來說是必填，用來測試是不是到底了
      return typeof this.firstValue(value).field === 'string'
    },
    firstValue(object) {
      return object[Object.keys(object)[0]]
    }
  }
}
</script>
