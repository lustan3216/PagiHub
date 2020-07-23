import store from '../store'
import { allEqual, cloneJson } from './tool'
import { capitalize } from './string'
import { NODE_TYPE, NODE_TYPE_STRING, KIND, LABEL } from '@/const'

export function findFirstCommonParentTree(ids) {
  // familyPaths = [
  //   [1,2,3,4,5]
  //   [1,4,5,6,7,8]
  //   [1,8,9]
  // ]
  let familyPaths = ids.map(id => [
    ...store.getters['component/parentPath'](id),
    store.state.component.componentsMap[id]
  ])

  familyPaths = cloneJson(familyPaths)

  const maxXLength = Math.max(...familyPaths.map(path => path.length))

  let x = 0
  for (x; x < maxXLength; x++) {
    const sameYIds = familyPaths.map(path => path[x].id)
    if (!allEqual(sameYIds)) {
      break
    }
  }
  // 假如 index 1 開始都不一樣，所以都一樣的index 就是 x--
  const commonTree = familyPaths[0][x - 1]

  familyPaths.forEach(path => {
    path.slice(x).reduce((tree, node) => {
      if (tree.children) {
        tree.children.push(node)
      } else {
        tree.children = [node]
      }
      return node
    }, commonTree)
  })

  return commonTree
}

export function getNode(id, isExample) {
  if (isExample) {
    return store.state.example.basicExamplesMap[id]
  } else {
    return store.state.component.componentsMap[id]
  }
}

const cache = {}
export function shortTagName(node) {
  const tag = node[LABEL] || node.tag
  if (cache[tag]) {
    return cache[tag]
  }

  const splitTag = tag.split('-')
  if (splitTag[1] === 'generator') {
    cache[tag] = splitTag[0]
  } else if (splitTag[0] === 'form') {
    cache[tag] = splitTag[1]
  } else {
    cache[tag] = tag
  }
  cache[tag] = capitalize(cache[tag]).replace('-', '')
  return cache[tag]
}

export function traversalChildrenOf(nodeId, fn) {
  store.state.component.componentsMap[nodeId].children.forEach(child => {
    fn(child)
    traversalChildrenOf(child.id, fn)
  })
}

export function isProject(node) {
  return node.kind === NODE_TYPE.PROJECT
}

export function isComponent(node) {
  return node[KIND] === NODE_TYPE.COMPONENT
}

export function isFolder(node) {
  return node[KIND] === NODE_TYPE.FOLDER
}

export function isComponentSet(node) {
  return node[KIND] === NODE_TYPE.COMPONENT_SET
}

export function typeString(node) {
  return NODE_TYPE_STRING[node[KIND]]
}

let index = 1
const indexMap = {}
export function shortId(id) {
  if (indexMap[id]) {
    return indexMap[id]
  } else {
    indexMap[id] = index
    index++
    return indexMap[id]
  }
}

export function defineNodeProperties(node) {
  const { componentsMap } = store.state.component
  const defined = 'parentNode' in node

  if (!defined) {
    Object.defineProperty(node, 'parentNode', {
      get() {
        return componentsMap[this.parentId]
      },
      enumerable: false
    })

    Object.defineProperty(node, 'uniqId', {
      get() {
        const ids = [node.id]
        if (isComponent(node) && node.componentSetId) {
          ids.unshift(node.componentSetId)
        }
        return ids.join('-')
      },
      enumerable: false
    })

    Object.defineProperty(node, 'rootComponentSetId', {
      get() {
        return getRootComponentSet(node)
      },
      enumerable: false
    })
  }
}

const rootComponentSetIdMap = {}
let familyTreeIds = []
export function getRootComponentSetId(nodeId) {
  familyTreeIds.push(nodeId)
  const { componentsMap, rootComponentSetIds } = store.state.component

  if (rootComponentSetIdMap[nodeId]) {
    return rootComponentSetIdMap[nodeId]
  } else {
    const { parentId } = componentsMap[nodeId]
    const parentNode = componentsMap[parentId]

    if (rootComponentSetIds.includes(parentNode.id)) {
      familyTreeIds.forEach(id => (rootComponentSetIdMap[id] = parentNode.id))
      familyTreeIds = []
      return parentNode.id
    } else {
      return getRootComponentSetId(parentNode.id)
    }
  }
}
