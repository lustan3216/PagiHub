<script>
import SettingGenerators from './Common/SettingGenerators'
import { select } from './utils/ruleTool'
import {
  defaultSetting as gridSetting,
  rules as gridRules
} from './SettingGridGenerator'

export const defaultSetting = {
  grid: gridSetting,
  card: { shadow: 'always' }
}

gridRules.forEach(x => {
  x.path = 'grid'
})

const rules = {
  base: [select('shadow', { path: 'card', options: ['always', 'hover', 'never'] })],
  grid: gridRules
}

export default SettingGenerators('SettingCard', rules, defaultSetting)
</script>
