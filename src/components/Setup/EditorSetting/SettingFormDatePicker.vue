<script>
import { string, select, boolean, iconSelect } from './utils/ruleTool'
import {
  base,
  settings,
  placeholder,
  editable,
  clearable,
  readonly
} from './utils/form'
import FormSettingGenerator from '@/components/Setup/EditorSetting/Common/FormSettingGenerators'

export const defaultSetting = {
  ...settings,
  field: 'DatePicker',
  readonly: false,
  editable: true,
  clearable: true,
  placeholder: '',
  startPlaceholder: 'startPlaceholder',
  endPlaceholder: 'endPlaceholder',
  type: 'datetime',
  align: 'center',
  rangeSeparator: '-',
  defaultValue: new Date(),
  unlinkPanels: true,
  prefixIcon: null,
  clearIcon: null
}

const _base = base()
_base.push(clearable())
_base.push(editable())
_base.push(readonly())

const rules = {
  base: _base,
  customize: [
    select('type', {
      options: [
        'year',
        'month',
        'date',
        'dates',
        'week',
        'datetime',
        'datetimerange',
        'daterange'
      ],
      control: [
        {
          handle: x => x.includes('range'),
          rule: [
            select('rangeSeparator', {
              options: ['-', '/', '~']
            }),
            boolean('unlinkPanels'),
            string('startPlaceholder'),
            string('endPlaceholder')
          ]
        },
        {
          handle: x => !x.includes('range'),
          rule: [placeholder()]
        }
      ]
    }),
    string('format', {
      info:
        'https://element.eleme.io/#/zh-CN/component/date-picker#ri-qi-ge-shi'
    }),
    boolean('confirm'),
    iconSelect('prefixIcon'),
    iconSelect('clearIcon')
  ]
}

export default FormSettingGenerator(
  'SettingFormDatePicker',
  rules,
  defaultSetting
)
</script>
