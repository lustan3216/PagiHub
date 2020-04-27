<script>
import { iconSelect } from './utils/ruleTool'
import { settings, base, placeholder, clearable, readonly } from './utils/form'
import FormSettingGenerator from '@/components/Setup/EditorSetting/Common/FormSettingGenerators'

export const defaultSetting = {
  ...settings,
  field: 'formInput',
  type: 'text',
  placeholder: 'placeholder',
  clearable: true,
  prefixIcon: null,
  suffixIcon: null
}

const _base = base()
_base.splice(2, 0, placeholder())
_base.push(clearable())
_base.push(readonly())

const rules = {
  base: _base,
  customize: [iconSelect('prefixIcon'), iconSelect('suffixIcon')]
}

export default FormSettingGenerator('SettingFormInput', rules, defaultSetting)
</script>
