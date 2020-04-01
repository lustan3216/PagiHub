// timeline, 整個
//   stack 是指每個
// tree 個別樹更新完之後，去diff把diff tree結果記錄下來

// 每個要更新的地方 先算好要刪除新增修改的地方，變成object
// 再用字串表示是修改 '' {12: { style: { asd: 123 }}, 24: { style: { asd: 123 }}}
// 刪除的話用undefined表示
//
// 新增component的地方 id 要重
// 'sda.sda.e[0][432]'
import jsonDiffPatch from '../vendor/jsonDiffPatch.js'
import { toArray } from '../utils/polyfill.js'
import { isObject } from './device'
window.jsonDiffPatch = jsonDiffPatch
let _id = 0
class JsonHistory {
  // deltas = [newPatches...oldPatches]
  // currentIndex 往右的要馬上存進資料庫，往左的不用, 這個邏輯包出去別的class寫
  constructor({ id = _id, tree = {}, backUpDeltas = [], callback = {}}) {
    this.currentIndex = 0
    this.id = id
    this.tree = tree
    this.deltas = backUpDeltas
    this.callback = {
      onRecord() {},
      onUndo() {},
      onRedo() {},
      ...callback
    }
    _id++
  }

  get currentDeltaGroup() {
    return this.deltas[this.currentIndex]
  }

  record(rows = []) {
    const group = []
    const ensureRows = toArray(rows)

    ensureRows.forEach(row => {
      const delta = this.createDelta(row.path, row.value)
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
  createDelta(path, newValue) {
    const arrayPath = pathToArray(path)

    if (arrayPath.find(key => key === 'length')) {
      throw new Error('the path should not include length')
    }

    const isArrayIndexCollection = pathToArray1(path).map(key =>
      Boolean(key.match(/\[(\d+)\]/))
    )

    let runtimeTree = this.tree
    let delta = {}
    try {
      arrayPath.reduce((final, key, index) => {
        const isArrayIndex = isArrayIndexCollection[index]
        const isNextArrayIndex = isArrayIndexCollection[index + 1]
        const isEnd = index === arrayPath.length - 1
        const oldValue = runtimeTree[key]

        const assignTheRestObject = () => {
          const theRestOfPathArray = Array.from(arrayPath).splice(index + 1)
          final[key] = [
            oldValue,
            createNewValueByPathArray(theRestOfPathArray, newValue)
          ]
        }

        if (isArrayIndex) {
          if (isEnd) {
            if (oldValue === undefined) {
              if (newValue === undefined) {
                // 要刪除東西，但就值也是空的所以break
                throw new Error('break')
              } else {
                // Array要新增或插入但單個值，不知道是要做哪個，所以跳error，要求直接更新整個array
                throw new Error('not allow to update single value in array')
              }
            } else {
              if (newValue === undefined) {
                key = `_${key}`
                final[key] = [oldValue, 0, 0]
                final['_t'] = 'a'
              } else {
                // Array要新增或插入但單個值，不知道是要做哪個，所以跳error，要求直接更新整個array
                throw new Error('not allow to update single value in array')
              }
            }
          } else {
            if (oldValue === undefined) {
              if (newValue === undefined) {
                // 要刪除東西，但就值也是空的所以break
                throw new Error('break')
              } else {
                // Array要新增或插入但單個值，不知道是要做哪個，所以跳error，要求直接更新整個array
                throw new Error('not allow to update single value in array')
              }
            } else {
              if (newValue === undefined) {
                // 要刪除，跑路徑中
                key = `_${key}`
                final[key] = {}
                final['_t'] = 'a'
              } else {
                // 測試有沒有可能merge，才繼續走，不行就直接換掉
                if (oldValue[key]) {
                  final[key] = {}
                  final['_t'] = 'a'
                } else {
                  assignTheRestObject()
                  throw new Error('finish')
                }
              }
            }
          }
        } else {
          // isObjectKey
          if (isEnd) {
            if (oldValue === undefined) {
              if (newValue === undefined) {
                throw new Error('break')
              } else {
                // 'a.b.c.d = 2'  新增
                final[key] = [newValue]
              }
            } else {
              if (newValue === undefined) {
                // 'a.b = undefined'  刪除
                // 'a.b.c = undefined'  刪除
                final[key] = [oldValue, 0, 0]
              } else {
                // 'a.b = 2'  更新
                // 'a.b.c = 2'  更新
                if (Array.isArray(oldValue) && Array.isArray(newValue)) {
                  // 'a = oldValue newArray [1,2,3] 直接用diff生delta
                  final[key] = jsonDiffPatch.diff(oldValue, newValue)
                } else {
                  final[key] = [oldValue, newValue]
                }
              }
            }
          } else {
            if (oldValue === undefined) {
              if (newValue === undefined) {
                // 要刪除東西，但就值也是空的所以break
                throw new Error('break')
              } else {
                // 要新增但跑路徑中
                assignTheRestObject()
                throw new Error('finish')
              }
            } else {
              if (
                (Array.isArray(oldValue) && !isNextArrayIndex) ||
                (isObject(oldValue) && isNextArrayIndex) ||
                (!isObject(oldValue) && !Array.isArray(oldValue))
              ) {
                if (newValue === undefined) {
                  throw new Error('break')
                } else {
                  assignTheRestObject()
                  throw new Error('finish')
                }
              } else {
                final[key] = {}
              }
            }
          }
        }

        runtimeTree = runtimeTree[key]
        return final[key]
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
    const group = this.currentDeltaGroup

    group.forEach(delta => jsonDiffPatch.patch(this.tree, delta))

    this.callback.onRedo()
    return this.tree
  }

  undo() {
    const maxIndex = this.deltas.length - 1
    if (this.currentIndex > maxIndex) return
    const group = this.currentDeltaGroup

    group.forEach(delta => jsonDiffPatch.unpatch(this.tree, delta))

    this.currentIndex++
    this.callback.onUndo()
    return this.tree
  }
}

function toArrayIndex(key) {
  // '[0]'.match(/\[(\d+)\]/)
  // ["[0]", "0", index: 0, input: "[0]", groups: undefined]
  const result = key.match(/\[(\d+)\]/)
  return result !== null && result[1]
}

function createNewValueByPathArray(pathArray, value) {
  if (!pathArray.length) return value
  const isArrayIndex = toArrayIndex(pathArray[0])
  const init = isArrayIndex ? [] : {}

  pathArray.reduce((final, key, index) => {
    const isArrayIndex = toArrayIndex(key)
    if (isArrayIndex) key = isArrayIndex
    const isLastOne = pathArray.length - 1 === index

    if (isLastOne) {
      final[key] = value
    } else {
      const isNextOneArray = pathArray[index + 1].match(/\[\d+\]/)
      final[key] = isNextOneArray ? [] : {}
    }

    return final[key]
  }, init)

  return init
}

function pathToArray1(path) {
  // '1.a.b.c[321].d.e[0][1]'.match(/\w+(?=\.|\[)|\d+(?=\])/g)
  // ["1", "a", "b", "c", "[321]", "d", "e", "[0]", "[1]"]
  return path
    .toString()
    .replace(/\s/g)
    .match(/[\w|\d]+(?=\.|\[)?|\[\d+\]/g)
}

function pathToArray(path) {
  // '1.a.b.c[321].d.e[0][1]'.match(/\w+(?=\.|\[)|\d+(?=\])/g)
  // ["1", "a", "b", "c", "321", "d", "e", "0", "1"]
  return path
    .toString()
    .replace(/\s/g)
    .match(/[\w|\d]+(?=\.|\[)?|\d+(?=\])/g)
}

export default JsonHistory
