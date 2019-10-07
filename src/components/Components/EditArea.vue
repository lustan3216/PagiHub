<template>
  <draggable
    :value="innerChildren"
    handle=".drag-handler"
    class="edit-area"
    group="editableArea"
    @input="innerChildren = $event"
  >
    <component
      v-for="child in innerChildren"
      :is="isInlineElement(child) ? 'span' : 'div'"
      :key="child.id"
      class="wrapper"
      @click.stop="emitOpenEditBar(child.id)"
    >
      <component
        :is="child.tag"
        :key="child.id"
        :id="child.id" />
    </component>
  </draggable>
</template>

<script>
import { emitOpenEditBar } from '../../buses/editBar'
import importTemplates from '../../mixins/importTemplates'
import childrenMixin from '../../mixins/children'
import commonMixin from '../../mixins/common'

export default {
  name: 'EditArea',
  mixins: [importTemplates, childrenMixin, commonMixin],
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
  /*height: 100%;*/
}
</style>
