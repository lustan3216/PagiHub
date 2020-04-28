<script>
import { string, number, boolean } from './utils/ruleTool'
import { settings, base, placeholder, clearable, options } from './utils/form'
import FormSettingGenerators from '@/components/Setup/EditorSetting/Common/FormSettingGenerators'

export const defaultSetting = {
  ...settings,
  field: 'select',
  clearable: true,
  options: [],
  placeholder: 'placeholder',
  multiple: false,
  allowCreate: false,
  collapseTags: false,
  multipleLimit: 0,
  filterable: true,

  noMatchText: '无匹配数据',
  noDataText: '无数据',

  value: ['example']
}

const _base = base()
_base.splice(2, 0, placeholder())
_base.push(clearable())

const rules = {
  base: _base,
  customize: [
    options(),
    boolean('multiple', {
      control: [
        {
          value: true,
          rule: [number('multipleLimit', { info: '0 means unlimited' })]
        }
      ]
    }),
    string('noDataText'),
    string('noMatchText'),
    boolean('allowCreate')
  ]
}

export default FormSettingGenerators('SettingFormSelect', rules, defaultSetting)
</script>
