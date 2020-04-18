<template>
  <setting-generator
    :id="id"
    :spec="spec"
  />
</template>

<script>
import SettingGenerator from './Common/SettingGenerator'
import { assignDefaultValue, boolean, number, string } from './utils/util'
import form, {
  FIELD,
  SHOW_LABEL,
  PLACEHOLDER,
  DISABLED,
  READONLY,
  VALUE,
  SIZE
} from './utils/form'

const SHOW_WORD_LIMIT = 'showWordLimit'
const MAX_LENGTH = 'maxLength'
const MIN_LENGTH = 'minLength'

export const defaultSetting = {
  [FIELD]: 'textarea',
  [SHOW_LABEL]: true,
  [PLACEHOLDER]: false,
  [DISABLED]: false,
  [READONLY]: false,
  [SIZE]: 'mini',
  [MAX_LENGTH]: false,
  [MIN_LENGTH]: false,
  [SHOW_WORD_LIMIT]: true,
  [VALUE]: ''
}

export default {
  name: 'SettingFormTextarea',
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
          form[PLACEHOLDER],
          form[DISABLED],
          form[READONLY],
          form[SIZE],
          number(MAX_LENGTH),
          number(MIN_LENGTH),
          boolean(SHOW_WORD_LIMIT),
          string(VALUE)
        ],
        defaultSetting
      )
    }
  }
}
</script>
