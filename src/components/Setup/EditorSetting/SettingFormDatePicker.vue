<template>
  <setting-generator
    :id="id"
    :rules="spec"
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
} from './utils/ruleTool'
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
const TYPE = 'type'
const FORMAT = 'format'
const ALIGN = 'align'
const RANGE_SEPARATOR = 'rangeSeparator'
const UNLINK_PANELS = 'unlinkPanels'
const DEFAULT_VALUE = 'defaultValue'

export const defaultSetting = {
  [FIELD]: 'formDatepicker',
  [SHOW_LABEL]: true,
  [READONLY]: false,
  [DISABLED]: false,
  [CLEARABLE]: true,
  [SIZE]: 'mini',
  [PLACEHOLDER]: 'mini',
  [EDITABLE]: true,
  [UNLINK_PANELS]: true,
  [START_PLACEHOLDER]: 'startPlaceholder',
  [END_PLACEHOLDER]: 'endPlaceholder',
  [TYPE]: 'datetime',
  [FORMAT]: 'yyyy-MM-dd',
  [ALIGN]: 'left',
  [RANGE_SEPARATOR]: '-',
  [DEFAULT_VALUE]: new Date()
}

export default {
  name: 'SettingSettingFormDatePicker',
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
          boolean(UNLINK_PANELS),
          string(START_PLACEHOLDER),
          string(END_PLACEHOLDER),
          select(TYPE, {
            options: [
              'year',
              'month',
              'date',
              'dates',
              'week',
              'datetime',
              'datetimerange',
              'daterange'
            ]
          }),
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
