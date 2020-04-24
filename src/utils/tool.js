import { cloneJson } from 'json-storer/src/utils'
import merge from 'element-ui/src/utils/merge'
import { isUndefined, isString } from 'element-ui/src/utils/types'
import isPlainObject from 'is-plain-object'
import getValueByPath from 'lodash.get'
import { on, off } from 'element-ui/src/utils/dom.js'

export {
  cloneJson,
  isUndefined,
  isPlainObject,
  isString,
  merge,
  getValueByPath,
  on,
  off
}

export function onWithOff(a, b, c) {
  on(a, b, c)
  return () => off(a, b, c)
}

export const isArray = Array.isArray

export function allEqual(arr) {
  return arr.every(v => v === arr[0])
}

export function toArray(e) {
  if (isArray(e)) {
    return e
  } else if (e === undefined) {
    return []
  } else {
    return [e]
  }
}

export function arraySubtract(a, b) {
  return a.filter(n => !toArray(b).includes(n))
}

export function traversal(nodes, fn, parentNode) {
  toArray(nodes).forEach(node => {
    fn(node, parentNode)
    node.children && node.children.length && traversal(node.children, fn, node)
  })
}

export function deepFlatten(array) {
  return array.reduce((all, x) => {
    if (x.children) {
      all = all.concat(deepFlatten(x.children))
    }
    return all
  }, array)
}

export function findBy(array, key, value) {
  return array.find(x => x[key] === value)
}

export function findIndexBy(array, key, value) {
  return array.findIndex(x => x[key] === value)
}

export function deleteBy(array, key, value) {
  const oldIndex = findIndexBy(array, key, value)
  array.splice(oldIndex, 1)
}

export function nestedToLinerObject(target, nestedObject, key = 'children') {
  traversal(nestedObject, _node => {
    // eslint-disable-next-line
    const { children: _, ...node } = _node
    target[node.id] = node
  })

  return target
}

export function asyncGetValue(fn, timeout = 2000) {
  return new Promise(resolve => {
    const id = requestAnimationFrame(() => {
      const value = fn()

      if (!isUndefined(value)) {
        cancelAnimationFrame(id)
        resolve(value)
      }

      setTimeout(function() {
        cancelAnimationFrame(id)
      }, timeout)
    })
  })
}

export function cached(fn) {
  const cache = Object.create(null)
  return (function cachedFn(str) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  })
}
