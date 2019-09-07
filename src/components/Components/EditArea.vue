<template>
  <draggable
    :value="children"
    handle=".wrapper-handler"
    class="edit-area"
    group="editableArea"
    @input="$emit('update:children', $event)"
  >
    <template v-for="(child, index) in children">
      <div
        :key="child.id"
        class="wrapper"
        @mouseover="isHover = true"
        @mouseleave="isHover = false">
        <edit-bar
          :visible="isHover"
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
          :parent-id="parentId"
          :children="child.children"
        />
      </div>
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
  },
  data() {
    return {
      isHover: false
    }
  }
}
</script>

<style scoped lang="scss">
.edit-area {
  height: 100%;
  overflow: hidden;
  border: 1px dashed gray;
}
.wrapper {
  position: relative;
  padding: 15px;
  box-sizing: border-box;
}
.functions {
  top: -35px;
  right: 10px;
  position: absolute;
}
.edit-area {
  min-height: 100px;
}
</style>
