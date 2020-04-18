<template>
  <setting-generator
    :id="id"
    :spec="spec"
  />
</template>

<script>
import SettingGenerator from './Common/SettingGenerator'
import { select, string, assignDefaultValue } from './utils/util'

const SRC = 'src'
const FIT = 'fit'
const PLACEHOLDER = 'placeholder'
const ERROR = 'error'

export const defaultSetting = {
  [SRC]: 'https://placeimg.com/1320/840/any',
  [FIT]: 'cover',
  [PLACEHOLDER]: 'placeholder',
  [ERROR]: 'error'
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
          select(FIT, {
            options: ['fill', 'contain', 'cover', 'none', 'scale-down']
          }),
          string(SRC, {
            validate: [{ type: 'url', message: '需選擇正確的網址' }]
          }),
          string(PLACEHOLDER),
          string(ERROR)
        ],
        defaultSetting
      )
    }
  }
}
</script>
