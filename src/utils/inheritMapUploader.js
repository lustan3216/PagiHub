import store from '@/store'
import RequestQueue from '@/utils/requestQueue'
import { patchProject } from '@/api/node'
import {
  isInstanceParent,
  isMasterParent,
  getMasterId
} from '@/utils/inheritance'
import {
  getValueByPath,
  setValueByPath,
  unsetValueByPath,
  unsetValueByPathNested
} from '@/utils/tool'

const DEBOUNCE_TIME = 500

export function inheritMapPath(node) {
  const masterId = getMasterId(node)
  return ['inheritMap', masterId, 'usedBy', node.rootComponentSetId, node.id]
}

export function masterComponentSetPath(node) {
  return ['inheritMap', node.id, 'componentSet']
}

export function getMasterComponentSetIdFromInheritMap(node) {
  return getValueByPath(node.projectNode, [
    'inheritMap',
    getMasterId(node),
    'componentSet'
  ])
}

class InheritMapUploader {
  inheritMap = {}
  timerId = null
  queue = new RequestQueue()

  init(map) {
    this.inheritMap = map || {}
  }

  add(node) {
    if (isInstanceParent(node)) {
      this.cleanTime()
      setValueByPath(this, inheritMapPath(node), 1)
      this.setStore()
      this.startTime()
    }
  }

  setComponentSet(node) {
    if (isMasterParent(node)) {
      this.cleanTime()

      setValueByPath(
        this,
        masterComponentSetPath(node),
        node.rootComponentSetId
      )
      this.setStore()
      this.startTime()
    }
  }

  unsetComponentSet(node) {
    if (isMasterParent(node)) {
      this.cleanTime()

      unsetValueByPath(this.inheritMap, node.id)
      this.setStore()
      this.startTime()
    }
  }

  setStore() {
    store.commit(
      'node/SOFT_RECORD',
      {
        path: `${this.projectId}.inheritMap`,
        value: this.inheritMap
      },
      { root: true }
    )
  }

  remove(node) {
    if (isInstanceParent(node)) {
      this.cleanTime()
      unsetValueByPathNested(this, inheritMapPath(node))
      this.setStore(node)
      this.startTime()
    }
  }

  cleanTime() {
    clearInterval(this.timerId)
    this.timerId = null
  }

  startTime() {
    this.timerId = setTimeout(() => {
      this.queue.add(patchProject, {
        id: this.projectId,
        inheritMap: this.inheritMap
      })
    }, DEBOUNCE_TIME)
  }

  get projectId() {
    return store.state.node.editingProjectId
  }
}
const asd = new InheritMapUploader()

window.inheritMapUploader = asd

export default asd
