import basic from './basic'
import { boolean } from '../util'

const showAlpha = 'showAlpha'

export const defaultSetting = {
  field: 'formColorPicker',
  ...basic.showLabel.value,
  ...basic.disabled.value,
  ...basic.size.value,

  [showAlpha]: true
}

export default {
  ...basic.field.spec,
  ...basic.showLabel.spec,
  ...basic.disabled.spec,
  ...basic.size.spec,

  [showAlpha]: boolean(showAlpha)
}
