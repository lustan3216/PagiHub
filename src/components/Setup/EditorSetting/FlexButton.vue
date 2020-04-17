<template>
  <setting-generator
    :id="id"
    :spec="spec"
  />
</template>

<script>
import SettingGenerator from './Common/SettingGenerator'
import { select, boolean, assignDefaultValue } from './utils/util'

const PLAIN = 'plain'
const ICON = 'icon'
const TYPE = 'type'

export const defaultSetting = {
  [PLAIN]: false,
  [ICON]: undefined,
  [TYPE]: 'primary'
}

export default {
  name: 'FlexButton',
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
          boolean(PLAIN),
          select(TYPE, {
            options: ['primary', 'text']
          })
        ],
        defaultSetting
      )
    }
  }
}
</script>
