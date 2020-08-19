import { putComponentSetChildren } from '@/api/node'
import { getRootComponentSetId } from '@/utils/rootComponentSetId'
import { objectFirstKey } from '@/utils/tool'
import jsonHistory from '@/store/jsonHistory'

const DEBOUNCE_TIME = 2000

export default class RemoteState {
  remoteIndex = 0
  timerId = null
  requesting = false

  emitWhenRecord() {
    this.cleanTime()
    this.remoteIndex++

    if (!this.requesting) {
      this.startTime()
    }
  }

  emitWhenRedo() {
    this.cleanTime()
    if (!this.requesting) {
      this.startTime()
    }
  }

  emitWhenUndo() {
    this.cleanTime()
    if (!this.requesting) {
      this.startTime()
    }
  }

  cleanTime() {
    clearInterval(this.timerId)
    this.timerId = null
  }

  startTime() {
    this.timerId = setTimeout(this.requestPutDeltas.bind(this), DEBOUNCE_TIME)
  }

  requestPutDeltas() {
    try {
      if (this.remoteIndex === jsonHistory.currentIndex) {
        return
      }

      this.requesting = true
      const currentIndex = jsonHistory.currentIndex
      let deltas
      let action

      if (jsonHistory.currentIndex > this.remoteIndex) {
        deltas = this.transformDeltas(
          this.remoteIndex,
          jsonHistory.currentIndex
        )
        action = 'undo'
      }
      else if (jsonHistory.currentIndex < this.remoteIndex) {
        deltas = this.transformDeltas(
          jsonHistory.currentIndex,
          this.remoteIndex
        )
        action = 'redo'
      }

      putComponentSetChildren(deltas, action)
        .then(() => {
          this.remoteIndex = currentIndex
          this.requesting = false
          this.requestPutDeltas()
        })
        .catch(() => {
          this.requesting = false
          // save in localstroage
        })
    }
    catch (e) {
      this.requesting = false
      throw e
    }
  }

  transformDeltas(index, index2) {
    const deltas = []
    jsonHistory.deltas.slice(index, index2).forEach(group => {
      const newGroup = []
      group.forEach(delta => {
        newGroup.push({
          delta,
          rootComponentSetId: getRootComponentSetId(objectFirstKey(delta))
        })
      })
      deltas.push(newGroup)
    })

    return deltas
  }
}
