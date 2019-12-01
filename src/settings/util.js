export const number = (field, { value } = {}) => ({
  field,
  title: field,
  type: 'InputNumber',
  value,
  info: '123123123'
})

export const select = (field, { options }) => ({
  field,
  title: field,
  type: 'select',
  value: options[0],
  options: options.map(label => ({ value: label, label }))
})

export const string = (field, { value, validate }) => ({
  type: 'input',
  field,
  title: field,
  value,
  validate
})

export const slider = {}

export const boolean = (field, { value = true } = {}) => ({
  field,
  title: field,
  type: 'switch',
  value
})
