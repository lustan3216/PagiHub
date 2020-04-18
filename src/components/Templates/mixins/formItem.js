import clone from 'clone'
import { mapMutations, mapState } from 'vuex'
import formCreate from '@form-create/element-ui'
import {
  Slider,
  Tooltip,
  InputNumber,
  RadioGroup,
  DatePicker,
  TimePicker,
  Rate
} from 'element-ui'

import Switch from '../../../vendor/element-ui/Switch'
import SelectUnit from '../../Components/SelectUnit'

formCreate.component('SelectUnit', SelectUnit)
formCreate.component('ElSwitch', Switch)
formCreate.component('ElSlider', Slider)
formCreate.component('ElTooltip', Tooltip)
formCreate.component('ElInputNumber', InputNumber)
formCreate.component('ElRadioGroup', RadioGroup)
formCreate.component('ElDatePicker', DatePicker)
formCreate.component('ElTimePicker', TimePicker)
formCreate.component('ElRate', Rate)

export default {
  components: {
    FormItem: formCreate.$form()
  },
  inject: ['rootForm'],
  data() {
    return {
      api: {},
      isValid: false,
      option: { ...this.rootForm.innerProps, submitBtn: { show: false }}
      // option 在form-create不是響應式的，需要透過方法更新
    }
  },
  computed: {
    ...mapState('draft', ['nodesMap']),
    rootProps() {
      return this.rootForm.innerProps
    },
    innerRule() {
      const node = clone(this.nodesMap[this.id]) || {}
      const innerRule = node
      const {
        value,
        field,
        showLabel,
        options = [],
        ...props
      } = this.innerProps

      if (!this.isExample) {
        node.on = { change: this.change }
      }

      innerRule.type = this.$options.type
      innerRule.props = props
      innerRule.field = field
      innerRule.options = options.map(label => ({
        label,
        value: label
      }))

      if (node.value !== undefined || value) {
        innerRule.value = node.value || value
      }

      if (showLabel) {
        innerRule.title = field || innerRule.field
      }

      return [innerRule]
    }
  },
  watch: {
    rootProps: {
      handler(value) {
        this.api.updateOptions(value)
      },
      deep: true
    }
  },
  created() {
    if (!this.isExample) {
      this.updateRootData({ isValid: false, value: this.innerRule[0].value })
    }
  },
  methods: {
    ...mapMutations('draft', ['RECORD']),
    change(value) {
      if (this.isExample) return
      this.api.validate(isValid => {
        this.isValid = isValid
        this.updateRootData({ isValid, value })
      })
    },
    updateRootData({ isValid, value }) {
      const field = this.innerRule[0].field
      this.RECORD([{ path: `${this.id}.value`, value }])
      this.rootForm.updateForm(field, value)
      this.rootForm.updateValid(field, isValid)
    }
  }
}
