import store from '@/store'
import { vmGet } from '@/utils/vmMap'
import { getRootComponentSetId } from '@/utils/rootComponentSetId'

export function defineNodeProperties(node) {
  const defined = 'parentNode' in node

  if (!defined) {
    const { componentsMap } = store.state.component

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
