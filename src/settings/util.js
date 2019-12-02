export const number = (field, { value } = {}) => ({
  field,
  title: field,
  type: 'InputNumber',
  value,
  info: '123123123'
})

export const select = (field, { options, value }) => ({
  field,
  title: field,
  type: 'select',
  value,
  options: options.map(label => ({ value: label, label }))
})

export const string = (field, { value, validate = [] }) => ({
  type: 'input',
  field,
  title: field,
  value,
  validate
})

export const slider = (field, { value, step = 0.1, min = 0, max = 1 }) => {
  return {
    type: 'slider',
    title: field,
    field,
    value,
    props: {
      step,
      min,
      max
    }
  }
}

export const boolean = (field, { value } = {}) => ({
  field,
  title: field,
  type: 'switch',
  value
})
