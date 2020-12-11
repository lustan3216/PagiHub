import { ID, PARENT_ID } from '../const'
import { toArray } from './array'
import { ulid } from 'ulid'
import { traversalSelfAndChildren } from '@/utils/node'

export function appendIds(
  nodes,
  parentId
) {
  if (parentId) {
    toArray(nodes).forEach(node => (node[PARENT_ID] = parentId))
  }

  traversalSelfAndChildren(nodes, (node, parentNode) => {
    node[ID] = ulid()

    if (parentNode) {
      node[PARENT_ID] = parentNode[ID]
    }
  })
}
