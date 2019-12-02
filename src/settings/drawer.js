import { pxPercent } from './validation'
import { boolean, select, string } from './util'

const appendToBody = 'append-to-body'
const modalAppendToBody = 'modal-append-to-body'
const closeOnPressEscape = 'close-on-press-escape'
const showClose = 'show-close'
const modal = 'modal'
const direction = 'direction'
const size = 'size'

export const defaultSetting = {
  [appendToBody]: true,
  [modalAppendToBody]: true,
  [closeOnPressEscape]: false,
  [showClose]: false,
  [modal]: false,
  [direction]: 'ltr',
  [size]: '30%'
}

export default {
  [appendToBody]: boolean(appendToBody, {
    value: defaultSetting[appendToBody]
  }),

  [modalAppendToBody]: boolean(modalAppendToBody, {
    value: defaultSetting[modalAppendToBody]
  }),

  [closeOnPressEscape]: boolean(closeOnPressEscape, {
    value: defaultSetting[closeOnPressEscape]
  }),

  [showClose]: boolean(showClose, { value: defaultSetting[showClose] }),

  [modal]: boolean([modal], { value: defaultSetting[modal] }),

  [direction]: select([direction], {
    value: defaultSetting[direction],
    options: ['rtl', 'ltr', 'ttb', 'btt']
  }),

  [size]: string(size, { value: defaultSetting[size], validate: [pxPercent] })
}
