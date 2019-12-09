import basic from './basic'
import { boolean } from '../util'

const showWorLimit = 'show-word-limit'

export const defaultSetting = {
  field: 'formTextarea',
  ...basic.placeholder.value,
  ...basic.disabled.value,
  ...basic.readonly.value,
  ...basic.showLabel.value,

  ...basic.maxlength.value,
  ...basic.minlength.value,
  type: 'textarea',
  [showWorLimit]: true
}

export default {
  ...basic.field.spec,
  ...basic.placeholder.spec,
  ...basic.disabled.spec,
  ...basic.readonly.spec,
  ...basic.showLabel.spec,

  ...basic.maxlength.spec,
  ...basic.minlength.spec,
  [showWorLimit]: boolean(showWorLimit, { value: defaultSetting[showWorLimit] })
}
