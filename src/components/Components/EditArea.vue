<template>
  <div
    :style="innerStyles"
    class="edit-area"
  >
    <draggable
      :value="innerChildren"
      handle=".drag-handler"
      group="editableArea"
      @input="innerChildren = $event">
      <template v-for="child in innerChildren">
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
          :is="child.tag"
          :key="child.id"
          :id="child.id"
          class="drag-handler"
          @click.stop.native="openEditBarById(child.id)"
        />
      </template>
    </draggable>
  </div>
</template>

<script>
import importTemplates from '../../mixins/importTemplates'
import childrenMixin from '../../mixins/children'
import commonMixin from '../../mixins/common'
import EditBar from '../Components/EditBar'

export default {
  name: 'EditArea',
  components: {
    EditBar
  },
  mixins: [importTemplates, childrenMixin, commonMixin]
}
</script>

<style scoped lang="scss">
.edit-area {
  height: calc(100% - 2px);
}
.drag-handler-icon {
  position: absolute;
  width: 12px;
  top: 5px;
  left: 5px;
}
.wrapper {
  position: relative;
}
</style>
