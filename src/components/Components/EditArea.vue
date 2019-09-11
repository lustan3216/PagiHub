<template>
  <draggable
    :value="children"
    handle=".drag-handler"
    class="edit-area"
    group="editableArea"
    @input="$emit('update:children', $event)"
  >
    <template v-for="(child, index) in children">
      <component
        :is="isInlineElement(child) ? 'span' : 'div'"
        :key="child.id"
        class="wrapper"
        @click.stop="setCurrentHover(child.id)"
      >
        <edit-bar
          :visible="currentHover === child.id"
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
    </template>
  </draggable>
</template>

<script>
// Line:20 這個component不儲存處理過的children，只會把有更改過的全部往父層傳，統一由children mixin處理
import EditBar from '../Components/EditBar'
import { emitCloseEditBar, onCloseEditBar } from '../../buses/editBar'
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
      currentHover: null
    }
  },
  watch: {
    currentHover(value) {
      this.$emit('editing', Boolean(value))
    }
  },
  created() {
    onCloseEditBar(() => {
      this.currentHover = null
    })
  },
  methods: {
    isInlineElement(child) {
      return ['flex-button'].includes(child.tag)
    },
    setCurrentHover(id) {
      emitCloseEditBar()
      this.currentHover = id
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
</style>
