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
import { mapGetters } from 'vuex'
import { appendNestedIds } from '../../utils/keyId'
import { getVm } from '../../utils/vmMap'
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
    ...mapGetters('nodes', ['parentPath', 'childrenOf']),
    firstChild() {
      return this.innerChildren[0]
    }
  },
  methods: {
    addTemplate(template) {
      appendNestedIds(template)
      template = this.cleanFormButtons(template)
      this.innerChildren = [template]
    },
    cleanFormButtons(template) {
      const form = 'form-generator'
      if (template.tag !== form) return template

      const formNode = this.parentPath(this.id).find(x => x.tag === form)

      if (!formNode) return template
      const vm = getVm(formNode.id)
      if (vm.button.submit) {
        template.children = template.children.filter(
          x => x.children[0].tag !== 'flex-submit'
        )
      }

      if (vm.button.reset) {
        template.children = template.children.filter(
          x => x.children[0] !== 'flex-reset'
        )
      }

      return template
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
