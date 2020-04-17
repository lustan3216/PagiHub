<template>
  <setting-generator
    :id="id"
    :spec="spec"
  />
</template>

<script>
import SettingGenerator from './Common/SettingGenerator'
import {
  assignDefaultValue,
  select,
  boolean,
  string,
  datepicker
} from './utils/util'
import form, {
  FIELD,
  SHOW_LABEL,
  READONLY,
  DISABLED,
  CLEARABLE,
  SIZE,
  PLACEHOLDER
} from './utils/form'

const EDITABLE = 'editable'
const START_PLACEHOLDER = 'startPlaceholder'
const END_PLACEHOLDER = 'endPlaceholder'
const IS_RANGE = 'isRange'
const ARROW_CONTROL = 'arrowControl'
const FORMAT = 'format'
const ALIGN = 'align'
const RANGE_SEPARATOR = 'rangeSeparator'
const DEFAULT_VALUE = 'defaultValue'

export const defaultSetting = {
  [FIELD]: 'formTimepicker',
  [SHOW_LABEL]: true,
  [READONLY]: false,
  [DISABLED]: false,
  [CLEARABLE]: true,
  [SIZE]: 'mini',
  [PLACEHOLDER]: 'mini',
  [EDITABLE]: true,
  [START_PLACEHOLDER]: 'startPlaceholder',
  [END_PLACEHOLDER]: 'endPlaceholder',
  [IS_RANGE]: false,
  [ARROW_CONTROL]: true,
  [FORMAT]: 'yyyy-MM-dd',
  [ALIGN]: 'left',
  [RANGE_SEPARATOR]: '-',
  [DEFAULT_VALUE]: new Date()
}

export default {
  name: 'FormTimePicker',
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
          form[CLEARABLE],
          form[SIZE],
          form[PLACEHOLDER],
          boolean(EDITABLE),
          string(START_PLACEHOLDER),
          string(END_PLACEHOLDER),
          boolean(IS_RANGE),
          boolean(ARROW_CONTROL),
          string(FORMAT),
          select(ALIGN, {
            options: ['left', 'month', 'right']
          }),
          select(RANGE_SEPARATOR, {
            options: ['-', '/', '~']
          }),
          datepicker(DEFAULT_VALUE)
        ],
        defaultSetting
      )
    }
  }
}
</script>
