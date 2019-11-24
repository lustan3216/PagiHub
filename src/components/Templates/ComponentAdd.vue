<template>
  <div v-if="firstChild" class="h-100">
    <template v-if="isFormItem">
      <form-item :rule="formRule" :option="{ submitBtn: { show: false } }" />
    </template>
    <template v-else>
      <component :is="firstChild.tag" :id="firstChild.id" />
    </template>
  </div>
  <div v-else class="flex-center h-100 pointer">
    <dialog-components :id="id" @add="addTemplate($event)" />
  </div>
</template>

<script>
import clone from 'clone'
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
    },
    isFormItem() {
      return !this.firstChild.tag && this.firstChild.type
    },
    formRule() {
      const node = { ...this.firstChild }
      node.on = { change: this.change }
      return [node]
    }
  },
  methods: {
    addTemplate(template) {
      appendNestedIds(template)
      this.innerChildren = [template]
    },
    change(value) {
      const node = clone(this.innerChildren[0])
      node.value = value
      this.innerChildren = [node]
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
