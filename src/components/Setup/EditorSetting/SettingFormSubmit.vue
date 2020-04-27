<script>
import { base, settings } from './utils/form'
import FormSettingGenerator from '@/components/Setup/EditorSetting/Common/FormSettingGenerators'
export const defaultSetting = settings

export default FormSettingGenerator('SettingFormSubmit', {
  base: base(x => x.field !== 'readonly')
}, settings)
</script>
