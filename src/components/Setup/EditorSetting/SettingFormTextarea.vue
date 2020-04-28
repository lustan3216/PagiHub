<script>
import { settings, base, placeholder, readonly } from './utils/form'
import { select, boolean, number } from './utils/ruleTool'
import FormSettingGenerators from '@/components/Setup/EditorSetting/Common/FormSettingGenerators'

export const defaultSetting = {
  ...settings,
  field: 'textarea',
  value: '',
  type: 'textarea',
  placeholder: '',
  readonly: false,
  maxlength: 100,
  minlength: 0,
  showWordLimit: true,
  autosize: {
    minRows: 5,
    maxRows: 5
  },
  resize: 'both',
  rows: 5
}

const _base = base()
_base.splice(2, 0, placeholder())
_base.push(readonly())

const rules = {
  base: _base,
  customize: [
    select('resize', {
      options: ['none', 'both', 'horizontal', 'vertical']
    }),
    number('minRows', { path: 'autosize' }),
    number('maxRows', { path: 'autosize' }),
    number('maxlength', { min: 0 }),
    number('minlength', { min: 0 }),
    boolean('showWordLimit')
  ]
}

export default FormSettingGenerators(
  'SettingFormTextarea',
  rules,
  defaultSetting
)
</script>
