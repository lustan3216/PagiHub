// timeline, 整個
// stack 是指每個
// tree 個別樹更新完之後，去diff把diff tree結果記錄下來

// 每個要更新的地方 先算好要刪除新增修改的地方，變成object
// 再用字串表示是修改 '' {12: { style: { asd: 123 }}, 24: { style: { asd: 123 }}}
// 刪除的話用undefined表示

import jsonDiffPatch from '../vendor/jsonDiffPatch.js'
import { toArray, isUndefined, isPlainObject } from '../utils/polyfill.js'
const isArray = Array.isArray

export default class JsonHistory {
  // deltas = [newPatches...oldPatches]
  // currentIndex 往右的要馬上存進資料庫，往左的不用, 這個邏輯包出去別的class寫
  constructor({ tree = {}, backUpDeltas = [], callback = {}}) {
    this.currentIndex = 0
    this.tree = tree
    this.deltas = backUpDeltas
    this.callback = {
      onRecord() {},
      onUndo() {},
      onRedo() {},
      ...callback
    }
  }

  get currentDeltaGroup() {
    return this.deltas[this.currentIndex]
  }

  delete(rows) {
    const ensureIsArray = toArray(rows)
    ensureIsArray.forEach(row => (row.value = undefined))
    return this.record(rows)
  }

  record(rows, newValue) {
    const group = []
    const ensureIsArray = toArray(rows)

    if (!isUndefined(newValue)) {
      ensureIsArray.forEach(row => (row.value = newValue))
    }

    ensureIsArray.forEach(row => {
      const delta = this._createDelta(
        row.path,
        cloneJson(row.value),
        row.insert
      )
      if (delta) {
        group.unshift(delta)
        jsonDiffPatch.patch(this.tree, delta)
      }
    })

    if (group.length) {
      this.deltas.unshift(group)
      this.callback.onRecord(this)
      return this.tree
    }
  }

  // path key 不允許有 length
  _createDelta(path, newValue, insert = false) {
    const pathSplit = pathStringSplit(path)
    const isArrayKeyArray = isArrayKeyToBooleanArray(pathSplit)
    const normalizedPathArray = toNormalizedPath(pathSplit)

    if (normalizedPathArray.find(key => key === 'length')) {
      throw new Error('the path should not include length')
    }

    let runtimeTree = this.tree
    let delta = {}

    try {
      normalizedPathArray.reduce((final, key, index) => {
        const isArrayKey = isArrayKeyArray[index]
        const isLastIndex = index === normalizedPathArray.length - 1
        const oldValue = cloneJson(runtimeTree[key])
        const isArrayKeyNext = isArrayKeyArray[index + 1]

        const theRestOfObject = () => {
          const theRestOfPathArray = Array.from(pathSplit).splice(index + 1)
          return createDeltaByPathArray(theRestOfPathArray, newValue)
        }

        const oldArrayAddRestOfObject = () => {
          const oldValueClone = cloneJson(runtimeTree)
          oldValueClone[key] = theRestOfObject()
          return arrayEmptyToNull(oldValueClone)
        }

        if (isArrayKey) {
          if (isLastIndex) {
            if (isUndefined(oldValue)) {
              if (isUndefined(newValue)) {
                throw new Error('should not happen')
              } else {
                if (isArray(runtimeTree)) {
                  // 判斷是 arrayIndex 且當下是 runtimeTree是array就不用算了，直接手動操作，用diff算比較快
                  const delta = jsonDiffPatch.diff(
                    runtimeTree,
                    oldArrayAddRestOfObject()
                  )
                  Object.assign(final, delta)
                } else {
                  throw new Error('should not happen')
                }
              }
            } else {
              if (isUndefined(newValue)) {
                key = `_${key}`
                final[key] = [oldValue, 0, 0]
                final['_t'] = 'a'
              } else {
                if (insert) {
                  final[key] = [newValue]
                } else {
                  final[key] = [oldValue, newValue]
                }
                final['_t'] = 'a'
              }
            }
          } else {
            if (isUndefined(oldValue)) {
              if (isUndefined(newValue)) {
                throw new Error('should not happen')
              } else {
                if (isArray(runtimeTree)) {
                  // 判斷是 arrayIndex 且當下是 runtimeTree是array就不用算了，直接手動操作，用diff算比較快
                  const delta = jsonDiffPatch.diff(
                    runtimeTree,
                    oldArrayAddRestOfObject()
                  )
                  Object.assign(final, delta)
                }

                throw new Error('finish')
              }
            } else {
              if (isUndefined(newValue)) {
                // 要刪除，跑路徑中
                if (isValueAndKeyMatch(isArrayKeyNext, oldValue)) {
                  final[key] = {}
                  final['_t'] = 'a'
                } else {
                  // 下一層已經找不到東西可以刪除，就不用處理
                  throw new Error('break')
                }
              } else {
                // 測試有沒有可能merge，才繼續走，不行就直接換掉
                if (isValueAndKeyMatch(isArrayKeyNext, oldValue)) {
                  final[key] = {}
                } else {
                  if (isArray(runtimeTree)) {
                    final[key] = [oldValue, theRestOfObject()]
                    final['_t'] = 'a'
                  } else {
                    throw new Error('should not happen')
                  }
                  throw new Error('finish')
                }
              }
            }
          }
        } else {
          // isObjectKey
          if (isLastIndex) {
            if (isUndefined(oldValue)) {
              if (isUndefined(newValue)) {
                throw new Error('break')
              } else {
                final[key] = [newValue]
              }
            } else {
              if (isUndefined(newValue)) {
                // 'a.b = undefined'  刪除
                // 'a.b.c = undefined'  刪除
                final[key] = [oldValue, 0, 0]
              } else {
                // 'a.b = 2'  更新
                // 'a.b.c = 2'  更新
                if (isArray(oldValue) && isArray(newValue)) {
                  // 'a = oldValue newArray [1,2,3] 直接用diff生delta
                  final[key] = jsonDiffPatch.diff(oldValue, newValue)
                } else {
                  final[key] = [oldValue, newValue]
                }
              }
            }
          } else {
            if (isUndefined(oldValue)) {
              if (isUndefined(newValue)) {
                // 要刪除東西，但就值也是空的所以break
                throw new Error('break')
              } else {
                final[key] = [oldValue, theRestOfObject()]
                throw new Error('finish')
              }
            } else {
              if (isValueAndKeyMatch(isArrayKeyNext, oldValue)) {
                final[key] = {}
              } else {
                // 這裡已知之後都會跑步成功，因為array 跟object不能合併，也因為下一層無法更新上層的資料結構，
                // 所以這裡直接算完結束
                if (isUndefined(newValue)) {
                  throw new Error('break')
                } else {
                  final[key] = [oldValue, theRestOfObject()]
                  throw new Error('finish')
                }
              }
            }
          }
        }

        runtimeTree = runtimeTree[key.replace(/^_/, '')]
        // 這裡的 key 有可能是要被刪除的，所以有可能被改成有底線的_1，但在runtimeTree從樹裡面拿值
        // 是不會有底線的，所以要拿掉
        return final[key]
        // 這裡值是製作delta用的，所以會用有底線的去拿值
      }, delta)
    } catch (e) {
      if (e.message === 'break') {
        delta = undefined
      } else if (e.message === 'finish') {
        // 提前結束迴圈，不用處理
      } else {
        throw e
      }
    }

    return delta
  }

  redo() {
    if (this.currentIndex < 1) return
    this.currentIndex--

    this.currentDeltaGroup.reverse().forEach(delta => {
      jsonDiffPatch.patch(this.tree, delta)
    })

    this.callback.onRedo()
    return this.tree
  }

  undo() {
    const maxIndex = this.deltas.length - 1
    if (this.currentIndex > maxIndex) return

    this.currentDeltaGroup.forEach(delta => {
      jsonDiffPatch.unpatch(this.tree, delta)
    })

    this.currentIndex++
    this.callback.onUndo()
    return this.tree
  }
}

function createDeltaByPathArray(pathArray, newValue) {
  if (!pathArray.length) return newValue
  const isArrayKey = toArrayKey(pathArray[0])
  const init = isArrayKey ? [] : {}

  pathArray.reduce((final, key, index) => {
    const isArrayKey = toArrayKey(key)
    const isLastIndex = pathArray.length - 1 === index

    if (isArrayKey) {
      key = isArrayKey
    }

    if (isLastIndex) {
      final[key] = newValue
    } else {
      const isNextOneArray = pathArray[index + 1].match(/\[\d+\]/)
      final[key] = isNextOneArray ? [] : {}
    }

    return final[key]
  }, init)

  return arrayEmptyToNull(init) // normalize [empty * 2, newValue, empty] to [null, null, newValue, null]
}

function isValueAndKeyMatch(isArrayKey, oldValue) {
  const isObjectKey = !isArrayKey
  return (
    (isArray(oldValue) && isArrayKey) ||
    (isPlainObject(oldValue) && isObjectKey)
  )
}

function toArrayKey(key) {
  // '[0]'.match(/\[(\d+)\]/)
  // ["[0]", "0", index: 0, input: "[0]", groups: undefined]
  const result = key.match(/\[(\d+)\]/)
  return result !== null && result[1]
}

function pathStringSplit(path) {
  // ["1", "a", "[321]", "d", "[0]"]
  return path
    .toString()
    .replace(/\s/g)
    .match(/[\w|\d]+(?=\.|\[)?|\[\d+\]/g)
}

function isArrayKeyToBooleanArray(path) {
  // [false, false, true, false, true]
  return path.map(key => Boolean(key.match(/\[(\d+)\]/)))
}

function toNormalizedPath(path) {
  // ["1", "a", "321", "d", "0"]
  return path.map(key => toArrayKey(key) || key)
}

function cloneJson(e) {
  if (isPlainObject(e) || isArray(e)) {
    return JSON.parse(JSON.stringify(e))
  } else {
    return e
  }
}

function arrayEmptyToNull(e) {
  return cloneJson(e)
}
