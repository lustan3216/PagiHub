import isPlainObject from 'is-plain-object'
import objectAssign from 'object-assign'
import { traversalSelfAndChildren } from '@/utils/node'

export {
  objectAssign
}

export function cloneObject(obj) {
  let copy

  // Handle the 3 simple types, and null or undefined
  if (obj == null || typeof obj !== 'object') return obj

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date()
    copy.setTime(obj.getTime())
    return copy
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = []
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = cloneObject(obj[i])
    }
    return copy
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {}
    for (const attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = cloneObject(obj[attr])
    }
    return copy
  }

  throw new Error("Unable to copy obj! Its type isn't supported.")
}

export function objectHasAnyValue(e) {
  if (isPlainObject(e)) {
    return Object.values(e)[0]
  }
  else {
    return e
  }
}

export function objectFirstKey(e) {
  return Object.keys(e)[0]
}

export function objectHasAnyKey(e) {
  return Boolean(objectFirstKey(e))
}

export function nestedToLinerObject(nestedObject, key = 'children') {
  const target = {}
  traversalSelfAndChildren(nestedObject, _node => {
    // eslint-disable-next-line
    const { children: _, ...node } = _node
    target[node.id] = node
  })

  return target
}
