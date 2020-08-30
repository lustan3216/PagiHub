import { isUndefined } from './tool'
export function arrayMove(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    const k = new_index - arr.length + 1
    while (k--) {
      arr.push(undefined)
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0])
  return arr // for testing
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

export function findLastIndex(array, fn) {
  const index = array
    .slice()
    .reverse()
    .findIndex(fn)
  const count = array.length - 1
  const finalIndex = index >= 0 ? count - index : index

  return finalIndex
}

export function allEqual(arr) {
  return arr.every(v => v === arr[0])
}

export function toArray(e) {
  if (isArray(e)) {
    return e
  }
  else if (e === undefined) {
    return []
  }
  else {
    return [e]
  }
}

export function arraySubtract(a, b) {
  return a.filter(n => !toArray(b).includes(n))
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
  }
  else {
    return array.find(x => x[key] === value)
  }
}

export function findIndexBy(array, key, value) {
  if (isUndefined(value)) {
    value = key
    return array.findIndex(x => x === value)
  }
  else {
    return array.findIndex(x => x[key] === value)
  }
}

export function deleteBy(array, key, value) {
  let oldIndex

  if (isUndefined(value)) {
    value = key
    oldIndex = findIndexBy(array, value)
  }
  else {
    oldIndex = findIndexBy(array, key, value)
  }

  array.splice(oldIndex, 1)
}
