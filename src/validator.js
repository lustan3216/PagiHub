export const validLetters = {
  trigger: 'blur',
  pattern: /^[\w|_|\-]*$/,
  message: '请输入英文或数字'
}

export const validEmail = {
  required: true,
  pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
  message: '请输入正确的邮箱'
}

export const validUrl = {
  pattern: /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
  message: '请输入正确网址'
}

export const validChinese = {
  required: true,
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

export const required = {
  trigger: 'blur',
  required: true,
  message: '此栏位为必填'
}

export const number = {
  trigger: 'blur',
  pattern: /[\d]*$/,
  message: `需为数字`
}

export const biggerThanZero = {
  trigger: 'blur',
  pattern: /^[\d]+(.[\d]*)?$/,
  message: `需为0或正数`
}

export const onBlur = { trigger: 'blur' }

export const onChange = { trigger: 'change' }

export const integer = { type: 'integer' }

export const array = { type: 'array' }

export const requiredSelect = Object.assign({}, required, onBlur, array)

export const name = [required, validLetters, min(4), max(25)]

export const account = [required, validLetters, min(6), max(12)]

export const password = [required, validLetters, min(6), max(20)]

export const email = [required, validEmail]

export const url = [required, validUrl]

export const bankName = [required, validChinese]

export const bankCardNumber = [required, number, min(15), max(20)]
