<template>
  <vue-dropzone
    id="dropzone"
    ref="dropzone"
    :use-custom-slot="true"
    :options="dropzoneOptions"
    class="dropzone"
    @vdropzone-drag-over="setIsAdding"
    @vdropzone-drop="drop"
    @vdropzone-error="error"
    @vdropzone-sending="sending"
    @vdropzone-complete="init"
  >
    <slot/>
  </vue-dropzone>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import { Auth } from 'aws-amplify'
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
import { isBackground, isCarousel, isGroup, isImage, isRectangle } from '@/utils/node'
import { flexImage } from '@/templateJson/basic'
import { vmGet } from '@/utils/vmMap'
import { horizontalUnitConvert } from '@/utils/layout'
import { Message } from 'element-ui'
import { appendIds } from '@/utils/nodeId'
import { GRID, STYLES } from '@/const'
import { ulid } from 'ulid'
import { asyncGetValue } from '@/utils/tool'

let timerId
let hoverIds = []

export default {
  name: 'FileDropZone',
  components: {
    vueDropzone: vue2Dropzone
  },
  data() {
    return {
      dropzoneOptions: {
        url: '',
        accept: (file, done) => {
          this.dropEvent.uploadingIndex++
          if (this.dropEvent.onlyAcceptOne && this.dropEvent.uploadingIndex > 1) {
            done('This element only accept one image.')
          }
          else {
            done()
          }
        },
        createImageThumbnails: false,
        maxFilesize: 2,
        autoProcessQueue: true,
        acceptedFiles: 'image/*',
        clickable: false,
        previewTemplate: '<div></div>',
        headers: {
          Authorization: '',
          accept: 'application/json, text/plain, */*',
          'X-Requested-With': null,
          'Cache-Control': null
        }
      },
      dropEvent: {
        clientX: 0,
        clientY: 0,
        x: 0,
        y: 0,
        droppedNode: null,
        onlyAcceptOne: false,
        uploadingIndex: 0
      }
    }
  },
  created() {
    Auth.currentSession()
      .then(session => {
        this.dropzoneOptions.headers.Authorization = session.getAccessToken().getJwtToken()
      })

    this.dropzoneOptions.url = `https://staging-api.lots.design/projects/${this.editingProjectId}/asset`
  },
  computed: {
    ...mapState('user', ['userId']),
    ...mapState('node', ['editingProjectId']),
    ...mapGetters('mode', ['isDraftMode']),
    ...mapGetters('layout', ['currentBreakpoint']),
    dropzone() {
      return this.$refs.dropzone
    }
  },
  watch: {
    isDraftMode(value) {
      if (value) {
        this.$refs.dropzone.enable()
      }
      else {
        this.$refs.dropzone.disable()
      }
    }
  },
  methods: {
    ...mapMutations('app', { APP_SET: 'SET' }),
    ...mapActions('node', ['irreversibleRecord', 'record']),
    init() {
      this.dropEvent = {
        clientX: 0,
        clientY: 0,
        x: 0,
        y: 0,
        droppedNode: null,
        onlyAcceptOne: false,
        uploadingIndex: 0
      }
      this.dropzone.removeAllFiles()
    },
    sending(file, xhr, formData) {
      const id = ulid()
      formData.append('id', id)
      formData.append('label', file.name)
      formData.append('path', '')
      this.queueComplete(id, file)
    },
    async queueComplete(id, file) {
      const { droppedNode, x, y, clientX, clientY } = this.dropEvent
      const src = `${this.assetHost}${this.userId}/${id}/${file.name}`

      let newNode
      if (isImage(droppedNode) || isRectangle(droppedNode)) {
        newNode = flexImage({
          props: {
            src
          },
          [GRID]: droppedNode[GRID],
          [STYLES]: droppedNode[STYLES]
        })

        appendIds(newNode, droppedNode.parentId)

        this.record([
          {
            path: newNode.id,
            value: newNode
          },
          {
            path: droppedNode.id,
            value: undefined
          }
        ])
      }

      else if (isBackground(droppedNode) || isGroup(droppedNode) || isCarousel(droppedNode)) {
        const imageRect = await this.getImageRect(file)
        const h = 300
        const w = imageRect.w / imageRect.h * h

        newNode = flexImage({
          props: {
            src
          },
          grid: {
            [this.currentBreakpoint]: {
              x: clientX - x - (w / 2) + (30 * this.dropEvent.uploadingIndex),
              y: clientY - y - (h / 2) + (30 * this.dropEvent.uploadingIndex),
              w: horizontalUnitConvert(droppedNode.id, w, 'px', '%'),
              h,
              unitH: 'px',
              unitW: '%'
            }
          }
        })

        let parentId = droppedNode.id

        if (isCarousel(droppedNode)) {
          const vm = vmGet(droppedNode.id)
          const slider = vm.$parent.currentSliderNode()
          parentId = slider.id
        }

        appendIds(newNode, parentId)

        this.record({
          path: newNode.id,
          value: newNode
        })
      }
      this.setBase64Preview(newNode.id, file)
      this.dropEvent.uploadingIndex++
    },
    error(file, message) {
      this.dropzone.removeFile(file)
      Message.error({
        duration: 5000,
        dangerouslyUseHTMLString: true,
        message: message
      })
    },
    getImageRect(file) {
      return new Promise((resolve) => {
        const _URL = window.URL || window.webkitURL

        const img = new Image()
        const objectUrl = _URL.createObjectURL(file)
        img.onload = function() {
          resolve({ w: this.width, h: this.height })
          _URL.revokeObjectURL(objectUrl)
        }
        img.src = objectUrl
      })
    },
    drop(event) {
      const { x, y } = event.target.closest('[data-image-droppable]').getBoundingClientRect()
      const droppedNode = this.getNode(event)

      this.dropEvent = {
        x,
        y,
        clientX: event.clientX,
        clientY: event.clientY,
        droppedNode,
        onlyAcceptOne: isImage(droppedNode) || isRectangle(droppedNode),
        uploadingIndex: 0
      }
    },
    async setBase64Preview(id, file) {
      const imageVm = await asyncGetValue(() => vmGet(id))
      imageVm.$parent.setBase64Preview(file)
    },
    setIsAdding(event) {
      this.APP_SET({ isAdding: true })
      clearTimeout(timerId)

      const node = this.getNode(event)

      if (node && hoverIds !== node.id) {
        hoverIds.forEach(id => this.$bus.$emit(`hover-${id}`, false))
        this.$bus.$emit(`hover-${node.id}`, true)

        hoverIds.push(node.id)
      }

      timerId = setTimeout(() => {
        this.APP_SET({ isAdding: false })
        timerId = null
        hoverIds.forEach(id => this.$bus.$emit(`hover-${id}`, false))
        hoverIds = []
      }, 100)
    },
    getNode(event) {
      const element = event.target.closest('[data-image-droppable]')
      if (element) {
        return element.__vue__.$parent.node
      }
    }
  }
}
</script>

<style scoped lang="scss">
  ::v-deep .dz-message {
    height: 100%;
  }
</style>