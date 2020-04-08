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

  set restoreIds(ids) {
    this.idSet = new Set([ROOT_ID, ...ids])
  }

  appendIdNested(nodes, fn) {
    traversal(nodes, (node, parentNode) => {
      if (node[ID]) {
        this.idSet.add(node[ID])
      } else {
        node[ID] = this.generateId()
      }

      if (parentNode) {
        node[PARENT_ID] = parentNode[ID]
      }

      this.specialCase(node)
    })
  }

  resetNestedIds(nodes) {
    traversal(nodes, (node, parentNode) => {
      delete node.i
      // grid-item has this key
      node[ID] = this.generateId()

      this.specialCase(node)
      if (parentNode) {
        node[PARENT_ID] = parentNode[ID]
      }
    })
  }

  generateId() {
    const max = Math.max(...this.idSet)
    const id = max + 1
    this.idSet.add(id)
    return id
  }
}
const componentIds = new KeyManagement()
const exampleIds = new KeyManagement()
const projectIds = new KeyManagement()

export { componentIds, exampleIds, projectIds }
