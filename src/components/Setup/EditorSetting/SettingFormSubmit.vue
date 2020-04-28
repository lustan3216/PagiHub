<script>
import { base, settings } from './utils/form'
import FormSettingGenerators from '@/components/Setup/EditorSetting/Common/FormSettingGenerators'
export const defaultSetting = settings

export default FormSettingGenerators('SettingFormSubmit', {
  base: base(x => x.field !== 'readonly')
}, settings)
</script>
