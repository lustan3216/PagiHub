import store from '@/store'
import RequestQueue from '@/utils/requestQueue'
import { patchProject } from '@/api/node'
import { getMasterId, isInstanceParent } from '@/utils/inheritance'
import { setValueByPath, unsetValueByPathNested } from '@/utils/tool'

const DEBOUNCE_TIME = 500

export function inheritPath(node) {
  const masterId = getMasterId(node)
  return [masterId, node.rootComponentSetId, node.id]
}

class InheritMapUploader {
  map = {}
  timerId = null
  queue = new RequestQueue()

  init(map) {
    this.map = map || {}
  }

  add(node) {
    if (isInstanceParent(node)) {
      this.cleanTime()
      setValueByPath(this.map, inheritPath(node), 1)
      this.setStore()
      this.startTime()
    }
  }

  setStore() {
    store.commit(
      'node/SOFT_RECORD',
      {
        path: `${this.projectId}.inheritMap`,
        value: this.map
      },
      { root: true }
    )
  }

  remove(node) {
    if (isInstanceParent(node)) {
      this.cleanTime()
      unsetValueByPathNested(this.map, inheritPath(node))
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
      this.queue.add(patchProject, { id: this.projectId, inheritMap: this.map })
    }, DEBOUNCE_TIME)
  }

  get projectId() {
    return store.state.node.editingProjectId
  }
}
const asd = new InheritMapUploader()

window.inheritMapUploader = asd

export default asd
