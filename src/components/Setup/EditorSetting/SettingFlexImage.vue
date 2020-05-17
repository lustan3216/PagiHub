<template>
  <rules-generator
    :id="id"
    :rules="spec"
  />
</template>

<script>
import RulesGenerator from './Common/RulesGenerator'
import { select, string, assignDefaultValue } from './utils/ruleTool'

const SRC = 'src'
const FIT = 'fit'
const ERROR = 'error'

export const defaultSetting = {
  [SRC]: 'https://placeimg.com/1320/840/any',
  [FIT]: 'cover',
  [ERROR]: 'The Image flys away'
}

export default {
  name: 'SettingFlexImage',
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
          select(FIT, {
            options: ['fill', 'contain', 'cover', 'none', 'scale-down']
          }),
          string(SRC, {
            validate: [{ type: 'url', message: '需選擇正確的網址' }]
          }),
          string(ERROR)
        ],
        defaultSetting
      )
    }
  }
}
</script>
