export function isMac() {
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0
}

export function isObject(value) {
  return value && typeof value === 'object' && value.constructor === Object
}
