import { ID, PARENT_ID, NODE_TYPE, MASTER_ID, CHILDREN } from '../const'
import { traversal } from './tool'
import IdMap from './idMap'

const CONNECTOR = 'a'

// master
// component id = 1a2    => component_id, a = connector, 2 => component_set_id
// component_set_id = 1  => component_set_id

// instance
// component id = 1a1i    => component_id, a = connector, 1a => component_set_instance_id
// component_set_id = 1i => component_id, i = connector

class IdManagement {
  idMap = new IdMap()
  projectIdSet = new Set([0]) // to prevent zero as ID

  constructor({ componentSetId = '' } = {}) {
    this.componentSetId = componentSetId.toString()
  }

  restoreIds(nodes) {
    traversal(nodes, node => {
      if (node.kind === NODE_TYPE.COMPONENT) {
        const { componentId, componentSetId } = this.departId(node.id)
        this.idMap.add(componentSetId, componentId)
      } else {
        const id = parseInt(node.id)
        this.projectIdSet.add(id)
      }
    })
  }

  resetComponentSetTree(componentSet) {
    componentSet[MASTER_ID] = componentSet[MASTER_ID] || componentSet[ID]
    componentSet[ID] = componentSetInstanceIds.create(componentSet[ID]) + 'i'

    traversal(componentSet[CHILDREN], (node, parentNode) => {
      if (node.kind === NODE_TYPE.COMPONENT_SET) {
        this.resetComponentSetTree(node)
        return false
      }

      node[MASTER_ID] = node[MASTER_ID] || node[ID]
      node[ID] = [parseInt(node[ID]), 'a', componentSet[ID]].join('')

      if (parentNode) {
        node[PARENT_ID] = parentNode[ID]
      } else {
        node[PARENT_ID] = componentSet[ID]
      }
    })
  }

  appendIdNested(nodes, componentSetId = '') {
    traversal(nodes, (node, parentNode) => {
      if (node.kind === NODE_TYPE.COMPONENT_SET) {
        this.resetComponentSetTree(node)
        return false
      } else if (node.kind === NODE_TYPE.COMPONENT) {
        node[ID] = this.generateComponentId(this.componentSetId || componentSetId)
      } else {
        node[ID] = this.generateProjectId()
      }

      if (parentNode) {
        node[PARENT_ID] = parentNode[ID]
      }
    })
  }

  generateComponentId(componentSetId = '') {
    // use 'a' as connector instead '-' to prevent functional watcher warning
    if (!componentSetId) {
      console.warn('ComponentId has no componentSetId')
    }
    const id = this.idMap.create(componentSetId)
    return [id, componentSetId].join(CONNECTOR)
  }

  generateProjectId() {
    const max = Math.max(...this.projectIdSet)
    const id = max + 1
    this.projectIdSet.add(id)

    return id.toString()
  }

  departId(id) {
    const [componentId, componentSetId] = id.split(CONNECTOR)
    if (componentSetId) {
      return {
        componentId,
        componentSetId
      }
    } else {
      return {
        componentId: null,
        componentSetId: componentId
      }
    }
  }
}

export const nodeIds = new IdManagement()
export const exampleIds = new IdManagement({ componentSetId: '0' })
export const componentSetInstanceIds = new IdMap()
