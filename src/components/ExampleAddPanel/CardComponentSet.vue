<template>
  <div
    v-if="component"
    :id="`example-${component.id}`"
    class="example-card"
  >
    <tip-copy class="m-b-10" />

    <div class="p-10 justify-between">
      <span style="visibility: hidden">ADD</span>
      <b style="line-height: 28px; font-size: 24px;">
        {{ shortTagName(component) }}
      </b>

      <el-button
        type="primary"
        @click="$emit('add', component)"
      >
        ADD
      </el-button>
    </div>

    <div class="relative z-index1 p-1">
      <example-view-port :id="id">
        <art-board :id="id" />
      </example-view-port>
    </div>

    <div v-if="component.tags && component.tags.length">
      <div class="p-15">
        <p class="title p-t-5 bold">Tags</p>

        <el-tag
          v-for="tag in component.tags"
          :key="tag"
          effect="plain"
          class="m-r-5"
        >
          {{ tag }}
        </el-tag>
      </div>
    </div>

    <div
      v-if="component.description"
      class="p-15"
    >
      <b class="title">Description</b>

      <p v-html="component.description" />
    </div>
  </div>
</template>

<script>
import { shortTagName, getNode } from '@/utils/node'
import ComponentGiver from '../TemplateUtils/ComponentGiver'
import TipCopy from '../Tip/TipCopy'
import { Tag } from 'element-ui'
import { mapState } from 'vuex'
import ExampleViewPort from './ExampleViewPort'
import ArtBoard from '@/components/Layout/ArtBoard'

export default {
  name: 'CardComponentSet',
  components: {
    ArtBoard,
    TipCopy,
    ComponentGiver,
    ElTag: Tag,
    ExampleViewPort
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState('app', ['beingAddedComponentId']),
    component() {
      return getNode(this.id)
    },
    node() {
      return getNode(this.beingAddedComponentId)
    }
  },
  methods: {
    shortTagName
  }
}
</script>

<style scoped lang="scss">
.example-card {
  border-radius: 5px;
  height: 100%;
  padding: 0 10px 10px;
}
.example {
  overflow: scroll;
  border: 1px solid $color-grey;
  padding: 5px;
}
</style>
