<template>
  <div
    v-if="node"
    :class="{ 'no-action': !selected, selected }"
    class="art-board"
  >
    <el-button
      :style="{
        fontSize: `${12 / scaleRatio}px`,
        top: `${-30 / scaleRatio}px`
      }"
      type="text"
      class="absolute"
    >
      <i
        v-if="selected"
        class="el-icon-edit-outline"
      /> {{ node.label }}
    </el-button>
    <component-set :id="node.id" />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import DialogInteracted from '@/components/Components/DialogInteracted'
import ComponentSet from '../TemplateUtils/ComponentSet'

export default {
  name: 'ArtBoard',
  components: {
    DialogInteracted,
    ComponentSet
  },
  provide() {
    return {
      rootComponentSetId: this.id
    }
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      canvasWidth: 0
    }
  },
  computed: {
    ...mapState('app', ['scaleRatio']),
    ...mapState('component', ['editingComponentSetId']),
    node() {
      return this.componentsMap[this.id]
    },
    selected() {
      return this.editingComponentSetId === this.id
    }
  },
  methods: {
    ...mapMutations('app', {
      appSET: 'SET'
    })
  }
}
</script>

<style scoped lang="scss">
.art-board {
  overflow: scroll;
  height: 100%;
}
</style>
