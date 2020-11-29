import jsonHistory from '@/store/jsonHistory'
import { findLastIndex } from '@/utils/array'
import { patchComponentSetChildren } from '@/api/node'

const DEBOUNCE_TIME = 1000
const INIT_TIME = +new Date()

class DraftStateUploader {
  remoteRecordTime = INIT_TIME
  timerId = null
  promise = null

  async emit(componentSetId) {
    this.cleanTime()

    await this.promise

    this.startTime(componentSetId)
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

      const requestDeltaTime = +new Date()

      this.promise = await patchComponentSetChildren({ tree, componentSetId })
      this.remoteRecordTime = requestDeltaTime
    }
    catch (e) {
      throw e
    }
    finally {
      this.promise = null
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
    }
  }
}

export default new DraftStateUploader()
