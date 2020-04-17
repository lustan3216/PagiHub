import { required, stringify } from './validation'
import { string, boolean, select, number, selectCreate } from './util'

export const FIELD = 'field'
export const PLACEHOLDER = 'placeholder'
export const DISABLED = 'disabled'
export const SIZE = 'size'
export const SHOW_LABEL = 'showLabel'
export const CLEARABLE = 'clearable'
export const READONLY = 'readonly'
export const MIN = 'min'
export const MAX = 'max'
export const OPTIONS = 'options'
export const VALUE = 'value'

export default {
  [FIELD]: string(FIELD, { validate: [required, stringify] }),

  [PLACEHOLDER]: string(PLACEHOLDER, { validate: [stringify] }),

  [DISABLED]: boolean(DISABLED, { value: false }),

  [SHOW_LABEL]: boolean(SHOW_LABEL),

  [CLEARABLE]: boolean(CLEARABLE),

  [READONLY]: boolean(READONLY),

  [MIN]: number(MIN),

  [MAX]: number(MAX),

  [OPTIONS]: selectCreate(OPTIONS, { options: ['example1', 'example2'] }),

  [SIZE]: select(SIZE, {
    options: ['large', 'medium', 'small', 'MINi']
  })
}
