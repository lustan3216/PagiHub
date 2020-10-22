import jsonHistory from '@/store/jsonHistory'
import { findLastIndex } from '@/utils/array'
import { patchComponentSetChildren } from '@/api/node'

const DEBOUNCE_TIME = 1000
const INIT_TIME = +new Date()

class DraftStateUploader {
  remoteRecordTime = INIT_TIME
  timerId = null
  requesting = false
  promise = null

  emitWhenRecord(componentSetId) {
    this.cleanTime()

    if (!this.requesting) {
      this.startTime(componentSetId)
    }
  }

  emitWhenRedo(componentSetId) {
    this.cleanTime()
    if (!this.requesting) {
      this.startTime(componentSetId)
    }
  }

  emitWhenUndo(componentSetId) {
    this.cleanTime()
    if (!this.requesting) {
      this.startTime(componentSetId)
    }
  }

  cleanTime() {
    clearInterval(this.timerId)
    this.timerId = null
  }

  startTime(componentSetId) {
    this.timerId = setTimeout(
      this.requestPutDeltas.bind(this, componentSetId),
      DEBOUNCE_TIME
    )
  }

  async requestImmediately(componentSetId) {
    if (this.promise) {
      await this.promise
    }

    this.cleanTime()
    this.requestPutDeltas(componentSetId)
  }

  async publish(componentSetId, tree) {
    try {
      await this.promise
      this.cleanTime()
      this.requesting = true

      const requestDeltaTime = +new Date()

      await patchComponentSetChildren({ tree, componentSetId })
      this.remoteRecordTime = requestDeltaTime
    }
    catch (e) {
      throw e
    }
    finally {
      this.promise = null
      this.requesting = false
    }
  }

  get currentDeltaTime() {
    const { currentIndex, deltas } = jsonHistory
    return deltas[currentIndex] ? deltas[currentIndex].createdAt : INIT_TIME
  }

  getRedoDeltas() {
    //        2.5 = remoteRecordTime
    // [5,4,3,    2,1]
    // [5,4,3,2,1].slice(0,3) = [5,4,3]
    const index = findLastIndex(jsonHistory.deltas, delta => {
      return delta.createdAt > this.remoteRecordTime
    })

    return jsonHistory.deltas.slice(jsonHistory.currentIndex, index + 1)
  }

  getUndoDeltas() {
    //      3.5 = remoteRecordTime
    // [5,4,   3,2,1]
    // [5,4,3,2,1].slice(0,3) = [5,4,3]
    const index = jsonHistory.deltas.findIndex(
      delta => delta.createdAt <= this.remoteRecordTime
    )
    return jsonHistory.deltas.slice(index, jsonHistory.currentIndex)
  }

  async requestPutDeltas(componentSetId) {
    try {
      if (this.remoteRecordTime === this.currentDeltaTime) {
        return
      }

      this.requesting = true
      let deltas
      let action

      if (this.currentDeltaTime > this.remoteRecordTime) {
        deltas = this.getRedoDeltas()
        action = 'redo'
      }
      else if (this.currentDeltaTime < this.remoteRecordTime) {
        deltas = this.getUndoDeltas()
        action = 'undo'
      }

      const requestDeltaTime = this.currentDeltaTime
      this.promise = await patchComponentSetChildren({
        deltas,
        action,
        componentSetId
      })

      this.remoteRecordTime = requestDeltaTime
      this.requestPutDeltas(componentSetId) // to check any new record is created when requesting
    }
    catch (e) {
      // should save in localstroage for tmp and update whole json to remote
      throw e
    }
    finally {
      this.promise = null
      this.requesting = false
    }
  }
}

export default new DraftStateUploader()
