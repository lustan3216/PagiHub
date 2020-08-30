import store from '@/store'
import {
  recordRootComponentSetId,
  getRootComponentSetId
} from '@/utils/rootComponentSetId'

export function defineProperties(node, rootComponentSetId) {
  recordRootComponentSetId(node, rootComponentSetId)

  const defined = 'parentNode' in node
  if (!defined) {
    const { componentsMap } = store.state.node

    Object.defineProperty(node, 'parentNode', {
      get() {
        return componentsMap[this.parentId]
      },
      enumerable: false
    })

    Object.defineProperty(node, 'rootComponentSetId', {
      get() {
        return getRootComponentSetId(node.id)
      },
      enumerable: false
    })

    Object.defineProperty(node, 'rootComponentSet', {
      get() {
        const id = getRootComponentSetId(node.id)
        return componentsMap[id]
      },
      enumerable: false
    })

    // Object.defineProperty(node, 'uniqId', {
    //   get() {
    //     const ids = [node.id]
    //     if (isComponent(node) && node.componentSetId) {
    //       ids.unshift(node.componentSetId)
    //     }
    //     return ids.join('-')
    //   },
    //   enumerable: false
    // })

    // Object.defineProperty(node, 'rootComponentSetId', {
    //   get() {
    //     return getRootComponentSetId(node.id)
    //   },
    //   enumerable: false
    // })
  }
}
