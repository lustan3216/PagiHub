import basic from './basic'

export const defaultSetting = {
  field: 'formInput',
  ...basic.placeholder.value,
  ...basic.showLabel.value,
  ...basic.clearable.value,
  ...basic.disabled.value,
  ...basic.readonly.value,
  ...basic.size.value
}

export default {
  ...basic.field.spec,
  ...basic.placeholder.spec,
  ...basic.showLabel.spec,
  ...basic.clearable.spec,
  ...basic.disabled.spec,
  ...basic.readonly.spec,
  ...basic.size.spec
}
