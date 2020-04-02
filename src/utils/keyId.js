export const ROOT_ID = 0
import { ID, PARENT_ID } from '../const'
import { traversal } from './util'

class KeyManagement {
  idSet = new Set([ROOT_ID])

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
    })
  }

  resetNestedIds(nodes) {
    traversal(nodes, (node, parentNode) => {
      delete node.i
      // grid-item has this key
      node[ID] = this.generateId()

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
const draftIds = new KeyManagement()
const exampleIds = new KeyManagement()

export { draftIds, exampleIds }
