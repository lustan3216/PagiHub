<template>
  <setting-generator
    :id="id"
    :spec="spec"
  />
</template>

<script>
import SettingGenerator from './Common/SettingGenerator'
import { boolean, assignDefaultValue, colorAlpha } from './utils/util'
import form, {
  FIELD,
  SHOW_LABEL,
  SIZE,
  MIN,
  MAX,
  VALUE,
  DISABLED,
  OPTIONS
} from './utils/form'

const TEXT_COLOR = 'textColor'
const FILL = 'fill'
const BUTTON = 'button'

export const defaultSetting = {
  [FIELD]: 'formRadio',
  [SHOW_LABEL]: true,
  [DISABLED]: false,
  [SIZE]: 'mini',
  [MIN]: 0,
  [MAX]: 10,
  [OPTIONS]: [],

  [TEXT_COLOR]: '#ffffff',
  [FILL]: '#409EFF',
  [BUTTON]: false,

  [VALUE]: false
}

export default {
  name: 'FormRadio',
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
          form[FIELD],
          form[SHOW_LABEL],
          form[DISABLED],
          form[SIZE],
          form[MIN],
          form[MAX],
          form[OPTIONS],
          colorAlpha(TEXT_COLOR),
          colorAlpha(FILL),
          boolean(BUTTON)
        ],
        defaultSetting
      )
    }
  }
}
</script>
