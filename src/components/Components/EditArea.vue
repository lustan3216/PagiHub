<template>
  <draggable
    :value="children"
    handle=".wrapper-handler"
    class="edit-area"
    group="editableArea"
    @input="$emit('update:children', $event)"
  >
    <template v-for="(child, index) in children">
      <edit-bar
        :children="children"
        :index="index"
        @update:children="$emit('update:children', $event)">
        <component
          v-bind="child.props"
          :is="child.tag"
          :key="child.id"
          :id="child.id"
          :parent-id="parentId"
          :children="child.children"
        />
      </edit-bar>
    </template>
  </draggable>
</template>

<script>
// 這個component不儲存處理過的children，只會把有更改過的全部往父層傳，統一由children mixin處理
import EditBar from '../Components/EditBar'
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
  }
}
</script>

<style scoped lang="scss">
.edit-area {
  height: calc(100% - 2px);
  border: 1px dashed gray;
}
</style>
