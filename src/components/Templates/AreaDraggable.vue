<template>
  <draggable
    :style="innerStyles"
    v-model="innerChildren"
    handle=".drag-handler"
    group="editableArea"
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
      <el-popover
        :value="isEditBarVisible(child.id)"
        :open-delay="100"
        :close-delay="0"
        :key="`popover${child.id}`"
        :ref="child.id"
        trigger="manual"
        placement="right"
      >
        <edit-bar :id="child.id" />
      </el-popover>
      
      <component
        v-popover:[child.id]
        :class="{
          'no-click': isEditableId !== child.id && child.tag !== 'grid-generator' && child.tag !== 'carousel',
          'fade-out': layoutEditable && child.tag !== 'grid-generator'
        }"
        :is="child.tag"
        :id="child.id"
      />
    </div>
  </draggable>
</template>

<script>
import { mapState } from 'vuex'
import importTemplates from '../../mixins/importTemplates'
import childrenMixin from '../../mixins/children'
import commonMixin from '../../mixins/common'
import EditBar from '../Components/EditBar'

export default {
  name: 'AreaDraggable',
  components: {
    EditBar
  },
  mixins: [importTemplates, childrenMixin, commonMixin],
  data() {
    return {
      isEditableId: null
    }
  },
  computed: {
    ...mapState('app', ['layoutEditable'])
  },
  methods: {
    mouseLeave() {
      this.isEditableId = null
    },
    click(id) {
      this.openEditBarById(id)
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
