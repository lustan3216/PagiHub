import { isPlainObject } from '../lodash'
Array.toArray = function(e) {
  if (Array.isArray(e)) {
    return e
  } else if (e === undefined) {
    return []
  } else {
    return [e]
  }
}

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

Object.firstValue = function(e) {
  if (isPlainObject(e)) {
    return Object.values(e)[0]
  } else {
    return e
  }
}
