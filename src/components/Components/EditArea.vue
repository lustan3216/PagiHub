<template>
  <draggable
    :value="children"
    handle=".drag-handler"
    class="edit-area"
    group="editableArea"
    @input="$emit('update:children', $event)"
  >
    <component
      v-for="(child, index) in children"
      :is="isInlineElement(child) ? 'span' : 'div'"
      :key="child.id"
      class="wrapper"
      @click.stop="emitOpenEditBar(child.id)"
    >
      <edit-bar
        :children="children"
        :index="index"
        @update:children="$emit('update:children', $event)"
      />
    
      <component
        v-bind="child.props"
        :ref="index"
        :is="child.tag"
        :key="child.id"
        :id="child.id"
        :style="child.styles"
        :parent-id="parentId"
        :children="child.children"
      />
    </component>
  </draggable>
</template>

<script>
// Line:20 這個component不儲存處理過的children，只會把有更改過的全部往父層傳，統一由children mixin處理
import EditBar from '../Components/EditBar'
import { emitOpenEditBar } from '../../buses/editBar'
import importTemplates from '../../mixins/importTemplates'

export default {
  name: 'EditArea',
  components: { EditBar },
  mixins: [importTemplates],
  props: {
    children: {
      type: Array,
      default() {
        return []
      }
    },
    parentId: {
      type: Number,
      required: true
    }
  },
  methods: {
    emitOpenEditBar,
    isInlineElement(child) {
      return ['flex-button'].includes(child.tag)
    }
  }
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
.wrapper {
  height: 100%;
}
</style>
