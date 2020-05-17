<template>
  <rules-generator
    :id="id"
    :rules="spec"
  />
</template>

<script>
import RulesGenerator from './Common/RulesGenerator'
import { select, assignDefaultValue } from './utils/ruleTool'

export const defaultSetting = {
  direction: 'horizontal'
}

export default {
  name: 'SettingDivider',
  components: { RulesGenerator },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      spec: assignDefaultValue(
        [
          select('direction', {
            options: ['horizontal', 'vertical']
          })
        ],
        defaultSetting
      )
    }
  }
}
</script>
