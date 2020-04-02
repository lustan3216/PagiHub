<template>
  <draggable
    :style="innerStyles"
    v-model="innerChildren"
    handle=".drag-handler"
    group="draftArea"
    class="edit-area"
    @input="$log(123)"
  >
    <div
      v-for="child in innerChildren"
      :key="child.id"
      class="drag-handler"
      @click.stop="click(child.id)"
      @mouseleave="mouseLeave"
    >
      <component
        :class="{
          'no-click': isEditableId !== child.id && child.tag !== 'grid-generator' && child.tag !== 'carousel',
          'fade-out': layoutDraft && child.tag !== 'grid-generator'
        }"
        :is="child.tag"
        :id="child.id"
      />
    </div>
  </draggable>
</template>

<script>
import { mapState } from 'vuex'
import VueDraggable from 'vuedraggable'
import importTemplates from '../../mixins/importTemplates'
import childrenMixin from '../../mixins/children'
import commonMixin from '../../mixins/common'

export default {
  name: 'AreaDraggable',
  components: {
    draggable: VueDraggable
  },
  mixins: [importTemplates, childrenMixin, commonMixin],
  data() {
    return {
      isEditableId: null
    }
  },
  computed: {
    ...mapState('app', ['layoutDraft'])
  },
  methods: {
    mouseLeave() {
      this.isEditableId = null
    },
    click(id) {
      this.isEditableId = id
    }
  }
}
</script>

<style scoped lang="scss">
.drag-handler-icon {
  position: absolute;
  width: 12px;
  top: 5px;
  left: 5px;
}
.edit-area {
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}
.fade-out {
  transition: opacity 0.6s ease;
  opacity: 0.1;
}
</style>
