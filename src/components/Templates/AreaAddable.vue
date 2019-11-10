<template>
  <div v-if="firstChild">
    <el-popover
      :value="isEditBarVisible(firstChild.id)"
      :open-delay="100"
      :close-delay="0"
      :key="`popover${firstChild.id}`"
      :ref="firstChild.id"
      trigger="manual"
      placement="right"
    >
      <edit-bar :id="firstChild.id" />
    </el-popover>
    <component
      v-popover:[firstChild.id]
      :is="firstChild.tag"
      :id="firstChild.id"
      @click.stop.native="openEditBarById(firstChild.id)"
    />
  </div>
  <div v-else class="flex-center h-100 pointer">
    <dialog-components @add="addTemplate($event)" />
  </div>
</template>

<script>
import { appendNestedIds } from '../../utils/keyId'
import importTemplates from '../../mixins/importTemplates'
import childrenMixin from '../../mixins/children'
import commonMixin from '../../mixins/common'
import EditBar from '../Components/EditBar'
import DialogComponents from './DialogComponents'

export default {
  name: 'AreaAddable',
  components: {
    EditBar,
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
