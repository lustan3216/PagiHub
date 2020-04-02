export const ROOT_ID = 0
import { ID } from '../const'
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
      fn && fn(node, parentNode)
    })
  }

  resetNestedIds(nodes) {
    traversal(nodes, node => {
      delete node.i
      // grid-item has this key
      node[ID] = this.generateId()
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

export {
  draftIds, exampleIds
}
