<template>
  <component
    v-if="firstChild"
    :is="firstChild.tag"
    :id="firstChild.id"
    :rule="firstChild"
    :children="firstChild.children"
  />
  <div v-else-if="isEditable" class="flex-center h-100 pointer">
    <dialog-components :id="id" @add="addTemplate($event)" />
  </div>
</template>

<script>
import { appendNestedIds } from '../../utils/keyId'
import importTemplates from '../../mixins/importTemplates'
import childrenMixin from '../../mixins/children'
import commonMixin from '../../mixins/common'
import DialogComponents from './DialogComponents'

export default {
  name: 'ComponentAdd',
  components: {
    DialogComponents
  },
  mixins: [importTemplates, childrenMixin, commonMixin],
  computed: {
    firstChild() {
      return this.innerChildren[0]
    }
  },
  methods: {
    addTemplate(template) {
      appendNestedIds(template)
      this.innerChildren = [template]
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
