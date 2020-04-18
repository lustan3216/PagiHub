<template>
  <setting-generator
    :id="id"
    :spec="spec"
  />
</template>

<script>
import SettingGenerator from './Common/SettingGenerator'
import { select, assignDefaultValue } from './utils/util'

const SHADOW = 'shadow'

export const defaultSetting = {
  [SHADOW]: 'always'
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
        [select(SHADOW, { options: ['always', 'hover', 'never'] })],
        defaultSetting
      )
    }
  }
}
</script>
