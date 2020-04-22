<template>
  <setting-generator
    :id="id"
    :rules="spec"
  />
</template>

<script>
import SettingGenerator from './Common/SettingGenerator'
import { boolean, assignDefaultValue, color } from './utils/ruleTool'
import form, {
  FIELD,
  SHOW_LABEL,
  DISABLED,
  SIZE,
  VALUE
} from './utils/form'

const SHOW_ALPHA = 'showAlpha'

export const defaultSetting = {
  [FIELD]: 'formCheckbox',
  [SHOW_LABEL]: true,
  [DISABLED]: false,
  [SIZE]: 'mini',
  [SHOW_ALPHA]: true,
  [VALUE]: '#fff'
}

export default {
  name: 'SettingFormColorPicker',
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
          boolean(SHOW_ALPHA),
          color(VALUE)
        ],
        defaultSetting
      )
    }
  }
}
</script>
