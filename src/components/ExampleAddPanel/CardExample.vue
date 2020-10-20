<template>
  <el-button
    :disabled="canNotAdd"
    style="border-color: #f1f1f1"
    @click="$emit('add')"
  >
    <div
      class="text-center"
      style="padding: 10px 0;"
    >
      {{ shortTagName({ tag }) }}
    </div>

    <div
      class="relative z-index1 p-1"
      style="font-size: 20px;"
    >
      <b-icon-fonts
        v-if="tag === 'text-editor'"
        class="gray-font-2"
      />
      <b-icon-image
        v-if="tag === 'flex-image'"
        class="gray-font-2"
      />
      <b-icon-aspect-ratio
        v-if="tag === 'grid-generator-item'"
        class="gray-font-2"
      />
      <b-icon-columns
        v-if="tag === 'grid-generator'"
        class="gray-font-2"
      />
      <b-icon-camera-video
        v-if="tag === 'video-player'"
        class="gray-font-2"
      />
      <b-icon-calendar3-event
        v-if="tag === 'iframer'"
        class="gray-font-2"
      />
      <b-icon-layout-sidebar-inset-reverse
        v-if="tag === 'carousel'"
        class="gray-font-2"
      />
      <b-icon-link
        v-if="tag === 'flex-button'"
        class="gray-font-2"
      />
    </div>
  </el-button>
</template>

<script>
import { shortTagName, isComponentSet, isGrid } from '@/utils/node'
import ArtBoard from '../Layout/ArtBoard'
import { Tag } from 'element-ui'
import { mapState } from 'vuex'

import {
  BIconFonts,
  BIconImage,
  BIconAspectRatio,
  BIconColumns,
  BIconCameraVideo,
  BIconCalendar3Event,
  BIconLayoutSidebarInsetReverse,
  BIconLink
} from 'bootstrap-vue'
export default {
  name: 'CardExample',
  components: {
    ArtBoard,
    ElTag: Tag,
    BIconFonts,
    BIconImage,
    BIconAspectRatio,
    BIconColumns,
    BIconCameraVideo,
    BIconCalendar3Event,
    BIconLayoutSidebarInsetReverse,
    BIconLink
  },
  props: {
    tag: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    ...mapState('app', ['beingAddedComponentId']),
    node() {
      return this.nodesMap[this.beingAddedComponentId]
    },
    canNotAdd() {
      return isComponentSet(this.node) && !isGrid({ tag: this.tag })
    }
  },
  methods: {
    shortTagName
  }
}
</script>

<style scoped lang="scss">
.outer {
  padding: 5px;
  height: 200px;
  border-radius: 3px;
  border: 1px solid $color-grey;
}
</style>
