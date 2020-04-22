<template>
  <setting-generator
    :id="id"
    :rules="spec"
  />
</template>

<script>
import SettingGenerator from './Common/SettingGenerator'
import { assignDefaultValue, string } from './utils/ruleTool'
import form, {
  FIELD,
  SHOW_LABEL,
  PLACEHOLDER,
  CLEARABLE,
  DISABLED,
  READONLY,
  SIZE,
  VALUE
} from './utils/form'

export const defaultSetting = {
  [FIELD]: 'formInput',
  [SHOW_LABEL]: true,
  [DISABLED]: true,
  [PLACEHOLDER]: false,
  [CLEARABLE]: 'mini',
  [READONLY]: 'mini',
  [SIZE]: 'mini',
  [VALUE]: ''
}

export default {
  name: 'SettingFormInput',
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
          form[CLEARABLE],
          form[SIZE],
          string(VALUE)
        ],
        defaultSetting
      )
    }
  }
}
</script>
