import basic from './formItem/basic'
import { pxPercent } from './validation'
import { boolean, select, string } from './util'

const inline = 'inline'
const labelPosition = 'labelPosition'
const hideRequiredAsterisk = 'hideRequiredAsterisk'
const showMessage = 'showMessage'
const statusIcon = 'statusIcon'
const labelWidth = 'labelWidth'
const type = 'type'

const defaultFormSetting = {
  [inline]: false,
  [labelPosition]: 'left',
  [hideRequiredAsterisk]: true,
  [showMessage]: true,
  inlineMessage: true,
  [statusIcon]: true,
  [labelWidth]: '125px'
}

const defaultInfoSetting = {
  [type]: 'poptip'
}

export const defaultSetting = {
  form: defaultFormSetting,
  info: defaultInfoSetting
}

export default {
  form: {
    [inline]: boolean(inline, { value: defaultFormSetting[inline] }),

    [labelPosition]: select(labelPosition, {
      value: defaultFormSetting[labelPosition],
      options: ['left', 'right']
    }),

    [hideRequiredAsterisk]: boolean(hideRequiredAsterisk, {
      value: defaultFormSetting[hideRequiredAsterisk]
    }),

    [showMessage]: boolean(showMessage, {
      value: defaultFormSetting[showMessage]
    }),

    [statusIcon]: boolean(statusIcon, {
      value: defaultFormSetting[statusIcon]
    }),

    [labelWidth]: string(labelWidth, {
      value: defaultFormSetting[labelWidth],
      validate: [pxPercent]
    })
  },
  info: {
    [type]: select(type, {
      value: defaultInfoSetting[type],
      options: ['poptip', 'tooltip']
    })
  }
}
