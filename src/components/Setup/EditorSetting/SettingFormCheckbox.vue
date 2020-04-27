<script>
import FormSettingGenerator from './Common/FormSettingGenerators'
import { colorAlpha, number, boolean, select } from './utils/ruleTool'
import { base, options, settings } from './utils/form'

export const defaultSetting = {
  ...settings,
  field: 'checkbox',
  min: null,
  max: null,
  options: ['example1', 'example2'],
  value: false,
  textColor: '#ffffff',
  fill: '#409EFF',
  button: false
}

const rules = {
  base: [
    ...base(x => x.field !== 'size'),
    boolean('button', {
      control: [
        {
          value: true,
          rule: [
            select('size', { options: ['large', 'medium', 'small', 'mini'] })
          ]
        }
      ]
    })
  ],
  customize: [
    number('min', { min: 0 }),
    number('max', { min: 0 }),
    options(),
    colorAlpha('textColor'),
    colorAlpha('fill')
  ]
}

export default FormSettingGenerator(
  'SettingFormCheckbox',
  rules,
  defaultSetting
)
</script>
