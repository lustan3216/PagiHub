<template>
  <middle-layer v-if="firstChild" :id="firstChild.id">
    <component
      :is="firstChild.tag"
      :id="firstChild.id"
      :rule="firstChild"
      :children="firstChild.children"
    />
  </middle-layer>
  <div v-else-if="isEditable" class="flex-center h-100 pointer">
    <dialog-components :id="id" @add="addTemplate($event)" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { appendNestedIds } from '../../../utils/keyId'
import { vmMap } from '../../../utils/vmMap'
import importTemplates from '../../../mixins/importTemplates'
import childrenMixin from '../../../mixins/children'
import commonMixin from '../../../mixins/common'
import DialogComponents from './DialogComponents'
import MiddleLayer from './MiddleLayer'
import { gridGenerator } from '../../../template/basic'
import { formGenerator } from '../../../template/formGroup'

export default {
  name: 'ComponentAdd',
  components: {
    DialogComponents,
    MiddleLayer
  },
  mixins: [importTemplates, childrenMixin, commonMixin],
  computed: {
    ...mapGetters('nodes', ['parentPath', 'childrenOf']),
    firstChild() {
      return this.innerChildren[0]
    },
    rootForm() {
      return this.parentPath(this.id).find(x => x.tag === 'form-generator')
    }
  },
  methods: {
    addTemplate(template) {
      this.cleanFormButtons(template)
      appendNestedIds(template)
      this.innerChildren = [template]
    },
    dealFormNode(template) {
      if (template.tag === 'form-generator') {
        if (this.rootForm) return gridGenerator(template.children)
      } else if (template.tag === 'form-item') {
        if (!this.rootForm) return formGenerator([template])
      }
      return template
    },
    cleanFormButtons(template) {
      if (this.rootForm && template.tag === 'form-generator') {
        const vm = vmMap[this.rootForm.id]

        template.children = template.children.filter(x => {
          const tag = x.children[0].tag
          if (tag === 'flex-submit') {
            return !vm.button.submit
          } else if (tag === 'flex-reset') {
            return !vm.button.reset
          } else {
            return true
          }
        })
      }
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
