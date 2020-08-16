<template>
  <rules-generator
    :id="id"
    :rules="spec"
  />
</template>

<script>
import RulesGenerator from './Common/RulesGenerator'
import { select, string, assignDefaultValue } from './utils/ruleTool'

export const defaultSetting = {
  src: location.origin,
  scrolling: 'auto'
}

export default {
  name: 'SettingIframer',
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
          string('src', {
            validate: [{ type: 'url', message: '需選擇正確的網址' }],
            props: {
              type: 'textarea',
              row: 3,
              resize: 'vertical'
            }
          }),
          select('scrolling', {
            options: ['auto', 'no']
          })
        ],
        defaultSetting
      )
    }
  }
}
</script>
