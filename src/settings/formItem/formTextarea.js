import basic from './basic'
import { number, boolean } from '../util'

const rows = 'rows'
const showWorLimit = 'show-word-limit'

export const defaultSetting = {
  field: 'formCheckbox',
  ...basic.placeholder.value,
  ...basic.clearable.value,
  ...basic.disabled.value,
  ...basic.readonly.value,
  ...basic.showLabel.value,

  ...basic.maxlength.value,
  ...basic.minlength.value,
  type: 'textarea',
  [showWorLimit]: true,
  [rows]: 3
}

export default {
  ...basic.field.spec,
  ...basic.placeholder.spec,
  ...basic.clearable.spec,
  ...basic.disabled.spec,
  ...basic.readonly.spec,
  ...basic.showLabel.spec,

  ...basic.maxlength.spec,
  ...basic.minlength.spec,
  [rows]: number(rows, { value: defaultSetting[rows] }),
  [showWorLimit]: boolean(showWorLimit, { value: defaultSetting[showWorLimit] })
}
