<script>
import { number, boolean } from './utils/ruleTool'
import { settings, base, min, max } from './utils/form'
import FormSettingGenerators from '@/components/Setup/EditorSetting/Common/FormSettingGenerators'

export const defaultSetting = {
  ...settings,
  field: 'slider',
  min: 0,
  max: 10,
  step: 1,
  precision: 1,
  showInput: false,
  showInputControls: true,
  showStops: false,
  showTooltip: true,
  range: true,
  value: 0
}

const rules = {
  base: base(),
  customize: [
    min(),
    max(),
    number('step', { min: 0, step: 0.01 }),
    boolean('range', {
      control: [
        {
          value: false,
          rule: [
            boolean('showInput', {
              control: [
                {
                  value: true,
                  rule: [boolean('showInputControls')]
                }
              ]
            })
          ]
        }
      ]
    }),
    boolean('showStops'),
    boolean('showTooltip')
  ]
}

export default FormSettingGenerators('SettingFormSlider', rules, defaultSetting)
</script>
