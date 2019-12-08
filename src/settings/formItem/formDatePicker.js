import basic from './basic'
import { select, boolean, string, datepicker } from '../util'

const editable = 'editable'
const startPlaceholder = 'startPlaceholder'
const endPlaceholder = 'endPlaceholder'
const type = 'type'
const format = 'format'
const align = 'align'
const rangeSeparator = 'rangeSeparator'
const unlinkPanels = 'unlinkPanels'
const defaultValue = 'defaultValue'

export const defaultSetting = {
  field: 'formDatepicker',
  ...basic.showLabel.value,
  ...basic.readonly.value,
  ...basic.disabled.value,
  ...basic.clearable.value,
  ...basic.size.value,
  ...basic.placeholder.value,

  [editable]: true,
  [unlinkPanels]: true,
  [startPlaceholder]: 'startPlaceholder',
  [endPlaceholder]: 'endPlaceholder',
  [type]: 'datetime',
  [format]: 'yyyy-MM-dd',
  [align]: 'left',
  [rangeSeparator]: '-',
  [defaultValue]: new Date()
}

export default {
  ...basic.field.spec,
  ...basic.showLabel.spec,
  ...basic.disabled.spec,
  ...basic.clearable.spec,
  ...basic.size.spec,
  ...basic.placeholder.spec,

  [editable]: boolean(editable),
  [unlinkPanels]: boolean(unlinkPanels),
  [startPlaceholder]: string(startPlaceholder),
  [endPlaceholder]: string(endPlaceholder),

  [type]: select(type, {
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
  [format]: string(format),

  [align]: select(align, {
    options: ['left', 'month', 'right']
  }),

  [rangeSeparator]: select(rangeSeparator, {
    options: ['-', '/', '~']
  }),

  [defaultValue]: datepicker(defaultValue)
}
