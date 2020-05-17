<template>
  <div
    v-if="node"
    :class="{ 'no-action': !selected, selected }"
    class="art-board"
    @click.stop="SET_EDITING_COMPONENT_SET_ID(id)"
  >
    <el-button
      :style="{ fontSize: `${12 / scaleRatio}px`, top: `${-30 / scaleRatio}px` }"
      type="text"
      class="absolute"
    >
      <i v-if="selected" class="el-icon-edit-outline" /> {{ node.name }}
    </el-button>
    <component-set
      :id="node.id"
    />
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
    ...mapState('component', ['tree', 'editingComponentSetId']),
    ...mapState('app', ['scaleRatio']),
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
    }),
    ...mapMutations('component', ['SET_EDITING_COMPONENT_SET_ID'])
  }
}
</script>

<style scoped lang="scss">
  .art-board {
    overflow: scroll;
    height: 100%;
  }
</style>
