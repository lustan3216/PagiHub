export const englishAndNumber = {
  trigger: 'blur',
  pattern: /^[\w|_|\-]*$/,
  message: '请输入英文或数字'
}

export const email = {
  trigger: 'blur',
  pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
  message: '请输入正确的邮箱'
}

export const url = {
  trigger: 'blur',
  pattern: /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
  message: '请输入正确网址'
}

export const mandarin = {
  trigger: 'blur',
  pattern: /^[\u4E00-\uFA29]*$/,
  message: '请输入中文字符'
}

export const min = min => ({
  trigger: 'blur',
  min,
  message: `最小字数为${min}位数`
})

export const max = max => ({
  trigger: 'blur',
  max,
  message: `最大字数为${max}位数`
})

export const biggerThanZero = {
  trigger: 'blur',
  pattern: /^[\d]+(.[\d]*)?$/,
  message: `需为0或正数`
}

export const pxPercent = {
  type: 'string',
  pattern: /(%|px)$/,
  message: '需選擇px或%'
}

export const required = {
  required: true,
  message: '一定要填喔'
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

export const username = [required, englishAndNumber, min(6), max(50)]

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
