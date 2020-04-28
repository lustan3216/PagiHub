<script>
import { colorAlpha, string } from './utils/ruleTool'
import { settings, base } from './utils/form'
import FormSettingGenerators from '@/components/Setup/EditorSetting/Common/FormSettingGenerators'

export const defaultSetting = {
  ...settings,
  field: 'switch',
  value: true,
  width: 40,
  activeColor: '#409EFF',

  inactiveColor: '#C0CCDA',
  activeText: 'activeText',
  inactiveText: 'inactiveText'
}

const rules = {
  base: base(),
  customize: [
    colorAlpha('activeColor'),
    colorAlpha('inactiveColor'),
    string('activeText'),
    string('inactiveText')
  ]
}

export default FormSettingGenerators('SettingFormSwitch', rules, defaultSetting)
</script>
