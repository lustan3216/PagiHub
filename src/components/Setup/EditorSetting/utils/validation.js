export const pxPercent = {
  type: 'string',
  pattern: /(%|px)$/,
  message: '需選擇px或%'
}

export const urlPath = {
  type: 'string',
  pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
  message: '需要正確的Url且包含http(s)'
}

export const required = {
  required: true,
  message: '一定要填喔'
}

export const stringify = {
  type: 'string',
  message: '要是文字喔'
}
