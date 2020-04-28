<template>
  <rules-generator
    :id="id"
    :rules="spec"
  />
</template>

<script>
import SettingGenerators from './Common/SettingGenerators'
import { select, assignDefaultValue } from './utils/ruleTool'

export const defaultSetting = {
  direction: 'horizontal'
}

const rules = {
  spec: assignDefaultValue(
    [
      select('direction', {
        options: ['horizontal', 'vertical']
      })
    ],
    defaultSetting
  )
}

export default SettingGenerators('SettingDivider', rules, defaultSetting)
</script>
