import { cloneJson } from '../utils/util'
import { ID, PARENT_ID, CHILDREN } from '../const'

export default function listToTree(data) {
  const tree = []
  const childrenOf = {}
  let item
  let id
  let parentId

  for (let i = 0, length = data.length; i < length; i++) {
    if (data[i].__ob__) {
      item = cloneJson(data[i])
    } else {
      item = data[i]
    }

    id = item[ID]
    parentId = item[PARENT_ID] || 0
    // every item may have children
    childrenOf[id] = childrenOf[id] || []
    // init its children
    item[CHILDREN] = childrenOf[id]
    if (parentId !== 0) {
      // init its parent's children object
      childrenOf[parentId] = childrenOf[parentId] || []
      // push it into its parent's children object
      childrenOf[parentId].push(item)
    } else {
      tree.push(item)
    }
  }

  return { tree, childrenOf }
}
