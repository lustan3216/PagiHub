<script>
import { colorAlpha, number, boolean, selectCreate } from './utils/ruleTool'
import { settings, clearable, max, base } from './utils/form'
import FormSettingGenerator from '@/components/Setup/EditorSetting/Common/FormSettingGenerators'

export const defaultSetting = {
  ...settings,
  field: 'formRate',
  max: 5,
  lowThreshold: 1,
  highThreshold: 1,
  allowHalf: true,
  lowColor: '#F7BA2A',
  midColor: '#F7BA2A',
  highColor: '#F7BA2A',

  voidColor: '#C6D1DE',
  disabledVoidColor: '#EFF2F7',

  showText: true,
  textColor: '#1F2D3D',
  showScore: false,
  texts: ['极差', '失望', '一般', '满意', '惊喜'],
  value: 0
}

const rules = {
  base: [...base(), clearable()],
  customize: [
    number('max', { min: 0 }),
    number('lowThreshold'),
    number('highThreshold'),
    boolean('allowHalf'),
    boolean('showText', {
      control: [
        {
          value: true,
          rule: [
            selectCreate('texts', {
              options: ['极差', '失望', '一般', '满意', '惊喜']
            }),
            colorAlpha('textColor')
          ]
        },
        {
          value: false,
          rule: [boolean('showScore')]
        }
      ]
    }),
    colorAlpha('lowColor'),
    colorAlpha('midColor'),
    colorAlpha('highColor'),
    colorAlpha('voidColor'),
    colorAlpha('disabledVoidColor')
  ]
}

export default FormSettingGenerator('SettingFormRate', rules, defaultSetting)
</script>
