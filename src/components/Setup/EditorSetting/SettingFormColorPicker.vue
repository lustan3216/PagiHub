<script>
import { boolean } from './utils/ruleTool'
import { settings, base } from './utils/form'
import FormSettingGenerators from '@/components/Setup/EditorSetting/Common/FormSettingGenerators'

export const defaultSetting = {
  ...settings,
  field: 'ColorPicker',
  showAlpha: true,
  value: '#fff'
}

const rules = {
  base: base(),
  customize: [
    boolean('showAlpha')
  ]
}

export default FormSettingGenerators(
  'SettingFormColorPicker',
  rules,
  defaultSetting
)
</script>
