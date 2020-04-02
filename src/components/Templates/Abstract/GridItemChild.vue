<template>
  <middle-layer v-if="firstChild" :id="firstChild.id">
    <component
      :is="firstChild.tag"
      :id="firstChild.id"
    />
  </middle-layer>
  <add-component v-else-if="isDraftMode && !isExample" :id="id" />
</template>

<script>
import importTemplates from '../../../mixins/importTemplates'
import childrenMixin from '../../../mixins/children'
import commonMixin from '../../../mixins/common'
import MiddleLayer from './MiddleLayer'
import AddComponent from './AddComponent'

export default {
  name: 'GridItemChild',
  components: {
    MiddleLayer,
    AddComponent
  },
  mixins: [importTemplates, childrenMixin, commonMixin]
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
