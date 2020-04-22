<template>
  <setting-generator
    :id="id"
    :rules="spec"
  />
</template>

<script>
import SettingGenerator from './Common/SettingGenerator'
import { select, assignDefaultValue } from './utils/ruleTool'

export const defaultSetting = {
  shadow: 'always'
}

export default {
  name: 'SettingCard',
  components: { SettingGenerator },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      spec: assignDefaultValue(
        [select('shadow', { options: ['always', 'hover', 'never'] })],
        defaultSetting
      )
    }
  }
}
</script>
