import { string, boolean, select, number, selectCreate } from '../util'
import { required, stringify } from '../validation'

const field = 'field'
const placeholder = 'placeholder'
const disabled = 'disabled'
const size = 'size'
const showLabel = 'showLabel'
const clearable = 'clearable'
const readonly = 'readonly'
const min = 'min'
const max = 'max'
const options = 'options'
const maxlength = 'maxlength'
const minlength = 'minlength'

export default {
  [field]: {
    spec: { [field]: string(field, { validate: [required, stringify] }) }
  },

  [placeholder]: {
    value: { [placeholder]: 'Placeholder' },
    spec: { [placeholder]: string(placeholder, { validate: [stringify] }) }
  },

  [disabled]: {
    value: { [disabled]: false },
    spec: { [disabled]: boolean(disabled, { value: false }) }
  },

  [size]: {
    value: { [size]: 'medium' },
    spec: {
      [size]: select(size, {
        options: ['large', 'medium', 'small', 'mini']
      })
    }
  },

  [showLabel]: {
    value: { [showLabel]: true },
    spec: {
      [showLabel]: boolean(showLabel)
    }
  },

  [clearable]: {
    value: { [clearable]: true },
    spec: { [clearable]: boolean(clearable) }
  },

  [readonly]: {
    value: { [readonly]: false },
    spec: { [readonly]: boolean(readonly) }
  },

  [min]: {
    value: { [min]: 0 },
    spec: { [min]: number(min) }
  },

  [max]: {
    value: { [max]: 10 },
    spec: { [max]: number(max) }
  },

  [maxlength]: {
    value: { [maxlength]: 0 },
    spec: { [maxlength]: number(maxlength) }
  },

  [minlength]: {
    value: { [minlength]: 10 },
    spec: { [minlength]: number(minlength) }
  },

  [options]: {
    value: { [options]: ['example1', 'example2'] },
    spec: {
      [options]: selectCreate(options, { options: ['example1', 'example2'] })
    }
  }
}
