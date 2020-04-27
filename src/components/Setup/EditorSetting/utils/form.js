import { required, text } from '@/validator'
import {
  string,
  boolean,
  select,
  number,
  selectCreate,
  selectUnit
} from './ruleTool'

export const settings = {
  label: 'default',
  form: {
    labelWidth: '125px',
    labelPosition: 'right',
    hideRequiredAsterisk: false,
    showMessage: true,
    inlineMessage: true,
    inline: false
  },
  size: 'mini',
  disabled: false,
  readonly: false,
  statusIcon: false,
  hidden: false
}

export function editable() {
  return boolean('editable', { value: false })
}

export function clearable() {
  return boolean('clearable')
}

export function prefixIcon() {
  return boolean('prefixIcon')
}

export function suffixIcon() {
  return boolean('suffixIcon')
}

export function min() {
  return number('min')
}

export function max() {
  return number('max')
}

export function options() {
  return selectCreate('options', { options: ['example1', 'example2'] })
}

export function placeholder() {
  return string('placeholder', { validate: [text] })
}

export function readonly() {
  return boolean('readonly')
}

export function base(fn) {
  const rules = [
    // submit and reset in the FormSettingGenerator due to they are reactive
    string('field', { validate: [required, text] }),
    select('size', { options: ['large', 'medium', 'small', 'mini'] }),
    select('validate', {
      props: { multiple: true },
      options: [
        'text',
        'url',
        'englishAndNumber',
        'mandarin',
        'biggerThanZero',
        'number',
        'email',
        'required'
      ],
      control: [
        {
          value: ['text'],
          rule: [string('Regex')]
        },
        {
          handle: x => x !== ['none'],
          rule: [
            boolean('statusIcon', { path: 'form' }),
            boolean('showMessage', { path: 'form' }),
            boolean('inlineMessage', { path: 'form' })
          ]
        }
      ]
    }),
    select('label', {
      options: ['default', 'custom'],
      control: [
        {
          value: 'default',
          rule: [
            boolean('inline', { path: 'form' }),
            boolean('hideRequiredAsterisk', { path: 'form' }),
            selectUnit('labelWidth', { path: 'form' })
          ]
        }
      ]
    }),
    boolean('disabled')
  ]

  if (fn) {
    return rules.filter(fn)
  } else {
    return rules
  }
}
