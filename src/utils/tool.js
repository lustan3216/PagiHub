import objectAssign from 'object-assign'
import { isUndefined, isString } from 'element-ui/src/utils/types'
import isPlainObject from 'is-plain-object'
import getValueByPath from 'lodash.get'
import { on, off } from 'element-ui/src/utils/dom.js'

export {
  isUndefined,
  isPlainObject,
  isString,
  getValueByPath,
  objectAssign,
  on,
  off
}

export function cloneJson(e) {
  return JSON.parse(JSON.stringify(e))
}

export function cloneObject(obj) {
  let copy;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = cloneObject(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (let attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = cloneObject(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}

export function onWithOff(element, event, handler) {
  on(element, event, handler)
  return () => off(element, event, handler)
}

export const isArray = Array.isArray

export function arrayFirst(e) {
  return e[0]
}

export function arrayLast(e) {
  return e[e.length - 1]
}

export function arrayUniq(e) {
  return [...new Set(e)]
}

export function splitAt(string, index) {
  return [string.slice(0, index), string.slice(index)]
}

export function objectHasAnyValue(e) {
  if (isPlainObject(e)) {
    return Object.values(e)[0]
  } else {
    return e
  }
}

export function objectFirstKey(e) {
  return Object.keys(e)[0]
}

export function objectHasAnyKey(e) {
  return Boolean(objectFirstKey(e))
}

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
    const stop = fn(node, parentNode)

    if (stop !== false) {
      node.children &&
        node.children.length &&
        traversal(node.children, fn, node)
    }
  })
}

export function deepFlatten(array) {
  return toArray(array).reduce((all, x) => {
    if (x.children) {
      all = all.concat(deepFlatten(x.children))
    }
    return all
  }, array)
}

export function findBy(array, key, value) {
  if (isUndefined(value)) {
    value = key
    return array.find(x => x === value)
  } else {
    return array.find(x => x[key] === value)
  }
}

export function findIndexBy(array, key, value) {
  if (isUndefined(value)) {
    value = key
    return array.findIndex(x => x === value)
  } else {
    return array.findIndex(x => x[key] === value)
  }
}

export function deleteBy(array, key, value) {
  let oldIndex

  if (isUndefined(value)) {
    value = key
    oldIndex = findIndexBy(array, value)
  } else {
    oldIndex = findIndexBy(array, key, value)
  }

  array.splice(oldIndex, 1)
}

export function nestedToLinerObject(nestedObject, key = 'children') {
  const target = {}
  traversal(nestedObject, _node => {
    // eslint-disable-next-line
    const { children: _, ...node } = _node
    target[node.id] = node
  })

  return target
}

export function asyncGetValue(fn, timeout = 2000) {
  return new Promise((resolve, reject) => {
    const id = requestAnimationFrame(() => {
      const value = fn()

      if (!isUndefined(value)) {
        cancelAnimationFrame(id)
        resolve(value)
      }

      setTimeout(function() {
        cancelAnimationFrame(id)
        resolve()
      }, timeout)
    })
  })
}
