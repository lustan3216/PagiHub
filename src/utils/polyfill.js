/* eslint-disabled */
import { kebabCase, capitalize } from 'element-ui/src/utils/util'
import { isPlainObject } from './tool'

Array.uniq = function(e) {
  return [...new Set(e)]
}

Array.last = function(e) {
  return e[e.length - 1]
}

Array.first = function(e) {
  return e[0]
}

Object.firstKey = function(e) {
  return Object.keys(e)[0]
}

Object.hasAnyKey = Object.firstKey

Object.firstValue = function(e) {
  if (isPlainObject(e)) {
    return Object.values(e)[0]
  } else {
    return e
  }
}

String.prototype.capitalize = function() {
  return capitalize(this)
}

String.prototype.kebabCase = function() {
  return kebabCase(this)
}

String.prototype.camelCase = function() {
  if (!this) return ''

  return this.replace(/([-_][a-z])/g, group =>
    group.toUpperCase().replace(/[-_]/g, '')
  )
}
