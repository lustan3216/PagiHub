import store from '@/store'
import { traversalAncestorAndSelf } from '@/utils/node'
import {
  recordRootComponentSetId,
  getRootComponentSetId
} from '@/utils/rootComponentSetId'

export function defineProperties(node, rootComponentSetId) {
  recordRootComponentSetId(node, rootComponentSetId)

  const defined = 'parentNode' in node
  if (!defined) {
    const { nodesMap } = store.state.node

    // Object.defineProperty(node, 'uniqId', {
    //   get() {
    //     if (node.inheritance && node.inheritance.masterId) {
    //       let inheritParentId
    //       traversalAncestorAndSelf(node, node => {
    //         const { isInstanceParent, isMasterParent } = node.inheritance
    //         if (isInstanceParent || isMasterParent) {
    //           inheritParentId = node.id
    //           return 'stop'
    //         }
    //       })
    //       return `${inheritParentId}-${node.id}`
    //     }
    //     else {
    //       return node.id
    //     }
    //   },
    //   enumerable: false
    // })

    Object.defineProperty(node, 'parentNode', {
      get() {
        return node.parentId && nodesMap[node.parentId]
      },
      enumerable: false
    })

    Object.defineProperty(node, 'rootComponentSetId', {
      get() {
        return getRootComponentSetId(node.id)
      },
      enumerable: false
    })

    Object.defineProperty(node, 'projectId', {
      get() {
        return node.rootComponentSet.parentId
      },
      enumerable: false
    })

    Object.defineProperty(node, 'projectNode', {
      get() {
        return node.projectId && nodesMap[node.projectId]
      },
      enumerable: false
    })

    Object.defineProperty(node, 'rootComponentSet', {
      get() {
        const id = getRootComponentSetId(node.id)
        return nodesMap[id]
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
