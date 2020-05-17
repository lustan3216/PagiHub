import store from '../store'
import { allEqual, cloneJson } from './tool'
import { capitalize } from './string'

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

const cache = {}
export function shortTagName(node) {
  const tag = node.name || node.tag
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
  store.getters['component/childrenOf'][nodeId].forEach(child => {
    fn(child)
    traversalChildrenOf(child.id, fn)
  })
}
