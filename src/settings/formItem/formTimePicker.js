import basic from './basic'
import { select, boolean, string, datepicker } from '../util'

const editable = 'editable'
const startPlaceholder = 'startPlaceholder'
const endPlaceholder = 'endPlaceholder'
const isRange = 'isRange'
const arrowControl = 'arrowControl'
const format = 'format'
const align = 'align'
const rangeSeparator = 'rangeSeparator'
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
  [startPlaceholder]: 'startPlaceholder',
  [endPlaceholder]: 'endPlaceholder',
  [isRange]: false,
  [arrowControl]: true,
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
  [isRange]: boolean(isRange),
  [arrowControl]: boolean(arrowControl),
  [startPlaceholder]: string(startPlaceholder),
  [endPlaceholder]: string(endPlaceholder),

  [format]: string(format),

  [align]: select(align, {
    options: ['left', 'month', 'right']
  }),

  [rangeSeparator]: select(rangeSeparator, {
    options: ['-', '/', '~']
  }),

  [defaultValue]: datepicker(defaultValue)
}
