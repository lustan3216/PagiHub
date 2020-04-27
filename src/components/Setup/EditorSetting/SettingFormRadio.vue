<script>
import { color, boolean, select } from './utils/ruleTool'
import { settings, options, base } from './utils/form'
import FormSettingGenerator from '@/components/Setup/EditorSetting/Common/FormSettingGenerators'

export const defaultSetting = {
  ...settings,
  field: 'FormRadio',
  button: false,
  options: ['example1', 'example2'],
  value: 'example1',
  textColor: '#ffffff',
  fill: '#153454',
  border: true
}

const rules = {
  base: base(x => x.field !== 'size'),
  customize: [
    options(),
    boolean('type', {
      props: { activeValue: 'button', inactiveValue: null },
      title: 'button',
      control: [
        {
          value: 'button',
          rule: [
            select('size', { options: ['large', 'medium', 'small', 'mini'] }),
            color('textColor'),
            color('fill')
          ]
        },
        {
          value: null,
          rule: [boolean('border')]
        }
      ]
    })
  ]
}

export default FormSettingGenerator('SettingFormRadio', rules, defaultSetting)
</script>
