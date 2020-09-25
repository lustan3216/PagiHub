export const englishAndNumber = {
  trigger: 'blur',
  pattern: /^[\w|_|\-]*$/,
  message: 'Only accept English letter or number or _ -.'
}

export const email = {
  trigger: 'blur',
  pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
  message: 'Please enter a valid email'
}

export const url = {
  trigger: 'blur',
  pattern: /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
  message: 'Please enter a valid url'
}

export const mandarin = {
  trigger: 'blur',
  pattern: /^[\u4E00-\uFA29]*$/,
  message: '请输入中文字符'
}

export const min = (min, text = 'letters') => ({
  trigger: 'change',
  min,
  message: `Minimum is ${min} ${text}`
})

export const max = (max, text = 'letters') => ({
  trigger: 'change',
  max,
  message: `Maximum is ${max} ${text}`
})

export const biggerThanZero = {
  trigger: 'blur',
  pattern: /^[\d]+(.[\d]*)?$/,
  message: `Should equal or bigger than zero`
}

export const pxPercent = {
  type: 'string',
  pattern: /(%|px)$/,
  message: 'Only allow px or %'
}

export const required = {
  required: true,
  message: 'Required'
}

export const text = {
  type: 'string',
  message: '要是文字喔'
}

export const onBlur = { trigger: 'blur' }

export const onChange = { trigger: 'change' }

export const integer = { type: 'integer' }

export const array = { type: 'array' }

export const requiredSelect = Object.assign({}, required, onBlur, array)

export const username = [required, englishAndNumber, min(8), max(50)]

export const label = [required, englishAndNumber, min(6), max(50)]

export const account = [min(6), max(50)]

export const password = [required, englishAndNumber, min(6), max(20)]

export default {
  englishAndNumber,
  email,
  url,
  mandarin,
  min,
  max,
  biggerThanZero,
  pxPercent,
  required,
  text,
  onBlur,
  onChange,
  integer,
  array,
  requiredSelect,
  name,
  account,
  password
}
