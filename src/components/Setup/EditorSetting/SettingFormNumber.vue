<script>
import { number, boolean, select } from './utils/ruleTool'
import { settings, base, clearable, min, max, placeholder } from './utils/form'
import FormSettingGenerators from '@/components/Setup/EditorSetting/Common/FormSettingGenerators'

export const defaultSetting = {
  ...settings,
  field: 'InputNumber',
  value: 10,
  controls: true,
  min: 0,
  max: 10,
  step: 1,
  precision: 1,
  controlsPosition: ''
}

const _base = base()
_base.splice(2, 0, placeholder())

const rules = {
  base: [..._base, clearable()],
  customize: [
    min(),
    max(),
    number('step'),
    number('precision', { step: 0.01 }),
    boolean('controls', {
      control: [
        {
          value: true,
          rule: [
            select('controlsPosition', {
              options: [{ label: 'Both Side', value: '' }, 'right']
            })
          ]
        }
      ]
    })
  ]
}

export default FormSettingGenerators('SettingFormNumber', rules, defaultSetting)
</script>
