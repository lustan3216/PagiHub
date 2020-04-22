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
  direction: 'horizontal'
}

export default {
  name: 'SettingFlexImage',
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
