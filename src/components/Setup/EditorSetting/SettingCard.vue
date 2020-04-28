<template>
  <rules-generator
    :id="id"
    :rules="spec"
  />
</template>

<script>
import RulesGenerator from './Common/RulesGenerator'
import { select, assignDefaultValue } from './utils/ruleTool'
import {
  rules as gridRules,
  defaultSetting as gridSetting
} from './SettingGridGenerator'

export const defaultSetting = {
  grid: gridSetting,
  card: { shadow: 'always' }
}

gridRules.forEach(x => {
  x.path = 'grid'
})

export default {
  name: 'SettingCard',
  components: { RulesGenerator },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      spec: assignDefaultValue(
        [
          select('shadow', {
            path: 'card',
            options: ['always', 'hover', 'never']
          })
        ],
        defaultSetting
      ),
      grid: assignDefaultValue(gridRules, defaultSetting)
    }
  }
}
</script>
