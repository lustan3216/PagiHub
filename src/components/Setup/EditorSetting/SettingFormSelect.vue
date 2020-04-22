<template>
  <setting-generator
    :id="id"
    :rules="spec"
  />
</template>

<script>
import SettingGenerator from './Common/SettingGenerator'
import { assignDefaultValue, number, boolean, string } from './utils/ruleTool'
import form, {
  FIELD,
  SHOW_LABEL,
  DISABLED,
  SIZE,
  CLEARABLE,
  OPTIONS,
  PLACEHOLDER,
  VALUE
} from './utils/form'

const MULTIPLE = 'multiple'
const MULTIPLE_LIMIT = 'multipleLimit'
const FILTERABLE = 'filterable'
const ALLOW_CREATE = 'allowCreate'
const NO_MATCH_TEXT = 'noMatchText'
const NO_DATA_TEXT = 'noDataText'

export const defaultSetting = {
  [FIELD]: 'formSelect',
  [SHOW_LABEL]: true,
  [DISABLED]: false,
  [SIZE]: 5,
  [CLEARABLE]: 5,
  [OPTIONS]: 5,
  [PLACEHOLDER]: 5,
  [MULTIPLE]: false,
  [FILTERABLE]: false,
  [ALLOW_CREATE]: false,

  [MULTIPLE_LIMIT]: 0,
  [NO_MATCH_TEXT]: '无匹配数据',
  [NO_DATA_TEXT]: '无数据',

  [VALUE]: ['example']
}

export default {
  name: 'SettingFormSelect',
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
          form[CLEARABLE],
          form[PLACEHOLDER],
          form[OPTIONS],

          string(NO_DATA_TEXT),
          string(NO_MATCH_TEXT),
          boolean(ALLOW_CREATE),
          boolean(FILTERABLE),
          boolean(MULTIPLE_LIMIT),
          number(MULTIPLE)
        ],
        defaultSetting
      )
    }
  }
}
</script>
