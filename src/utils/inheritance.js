import { getValueByPath, setValueByPath } from '@/utils/tool'
import { ID, MASTER_ID } from '@/const'
import { getNode } from '@/utils/node'
import { appendIds } from '@/utils/nodeId'

export function isMasterParent(node) {
  if (node) {
    return node.inheritance && node.inheritance.isMasterParent
  }
}

export function isInstanceParent(node) {
  if (node) {
    return node.inheritance && node.inheritance.isInstanceParent
  }
}

export function canInherit(node) {
  if (node) {
    return isMasterParent(node) || isInstanceParent(node)
  }
}

const PATH = ['inheritance', 'masterId']
export function getMasterId(node) {
  if (node) {
    return getValueByPath(node, PATH)
  }
}

export function setMasterId(node, id) {
  if (node) {
    setValueByPath(node, PATH, getMasterId(node) || id)
  }
}

export function appendIdsInherited(nodes, parentId) {
  const { rootComponentSetId } = getNode(nodes.id, false)
  nodes.inheritance = {
    isInstanceParent: true,
    masterComponentSetId: rootComponentSetId
  }

  appendIds(nodes, parentId, node => {
    setMasterId(node, node[ID])
  })
}
