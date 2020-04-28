<script>
import {
  select,
  boolean,
  string,
  datepicker,
  iconSelect
} from './utils/ruleTool'
import {
  settings,
  base,
  placeholder,
  clearable,
  editable,
  readonly
} from './utils/form'
import FormSettingGenerators from '@/components/Setup/EditorSetting/Common/FormSettingGenerators'

export const defaultSetting = {
  ...settings,
  field: 'timePicker',
  readonly: false,
  clearable: true,
  placeholder: 'mini',
  editable: true,
  startPlaceholder: 'startPlaceholder',
  endPlaceholder: 'endPlaceholder',
  isRange: false,
  arrowControl: true,
  align: 'center',
  rangeSeparator: '-',
  defaultValue: new Date()
}

const _base = base()
_base.push(clearable())
_base.push(editable())
_base.push(readonly())

const rules = {
  base: _base,
  customize: [
    boolean('arrowControl'),
    boolean('isRange', {
      control: [
        {
          value: true,
          rule: [
            select('rangeSeparator', {
              options: ['-', '/', '~']
            }),
            string('startPlaceholder'),
            string('endPlaceholder')
          ]
        },
        {
          value: false,
          rule: [placeholder()]
        }
      ]
    }),
    string('valueFormat', {
      title: 'format',
      info:
        'https://element.eleme.io/#/zh-CN/component/date-picker#ri-qi-ge-shi'
    }),
    iconSelect('prefixIcon'),
    iconSelect('clearIcon')
  ]
}

export default FormSettingGenerators(
  'SettingFormTextarea',
  rules,
  defaultSetting
)
</script>
