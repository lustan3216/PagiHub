import { mapMutations } from 'vuex'
import validator from '@/validator'
import { cloneJson, toArray } from '@/utils/tool'
import formCreate from '@form-create/element-ui/dist/form-create'
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
import SelectUnit from '@/components/Components/SelectUnit'
import { VALUE } from '@/const'

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
  data() {
    return {
      api: {},
      isValid: false,
      option: { submitBtn: { show: false }}
      // option 在form-create不是響應式的，需要透過方法更新}
    }
  },
  computed: {
    innerRule() {
      const {
        field,
        label,
        options = [],
        // eslint-disable-next-line
        form: _,
        validate = [],
        ...props
      } = this.innerProps

      const innerRule = {
        type: this.$options.type,
        props,
        field,
        style: this.innerStyles,
        value: this.innerValue,
        options: options.map(label => ({
          label,
          value: label
        })),
        validate: toArray(validate)
          .map(x => validator[x])
          .filter(x => x)
      }

      if (!this.isExample) {
        innerRule.on = { change: value => this.updateRecord(value) }
      }

      if (label === 'default') {
        innerRule.title = field || innerRule.field
      }

      return [innerRule]
    }
  },
  watch: {
    'innerProps.form': {
      handler() {
        this.api.updateOptions({ form: this.innerProps.form })
      }
    }
  },
  methods: {
    ...mapMutations('draft', ['RECORD']),
    updateRecord(value) {
      if (this.isExample) return
      this.RECORD([{ path: `${this.id}.${VALUE}`, value }])
    }
  }
}
