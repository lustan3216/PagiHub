export const ROOT_ID = 0
import { ID, PARENT_ID, TAG, GRID_ITEM } from '../const'
import { traversal } from './tool'

class KeyManagement {
  idSet = new Set([ROOT_ID])

  specialCase(node) {
    if (node[TAG] === GRID_ITEM) {
      node.i = node[ID]
    }
  }

  restoreIds(object) {
    const ids = Object.keys(object).map(x => parseInt(x))
    this.idSet = new Set([ROOT_ID, ...ids])
  }

  appendIdNested(nodes, suffix = '') {
    traversal(nodes, (node, parentNode) => {
      if (node[ID]) {
        this.idSet.add(parseInt(node[ID]))
      } else {
        node[ID] = bindSuffix(this.generateId(), suffix)
      }

      if (parentNode) {
        node[PARENT_ID] = parentNode[ID]
      }

      this.specialCase(node)
    })
  }

  resetNestedIds(nodes, suffix = '') {
    traversal(nodes, (node, parentNode) => {
      delete node.i
      // grid-item has this key
      node[ID] = bindSuffix(this.generateId(), suffix)

      this.specialCase(node)
      if (parentNode) {
        node[PARENT_ID] = parentNode[ID]
      }
    })
  }

  generateId(suffix = '') {
    const max = Math.max(...this.idSet)
    const id = max + 1
    this.idSet.add(id)
    return bindSuffix(id, suffix)
  }
}

function bindSuffix(id, suffix) {
  if (suffix) {
    // use a as joiner instead - to prevent function watcher warning
    return [id, suffix].join('a')
  } else {
    return id.toString()
  }
}

const componentIds = new KeyManagement()
const exampleIds = new KeyManagement()
const projectIds = new KeyManagement()

export { componentIds, exampleIds, projectIds }
