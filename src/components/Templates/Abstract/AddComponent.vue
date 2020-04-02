<template>
  <div class="flex-center h-100 pointer">
    <dialog-examples :id="id" @add="addTemplate($event)" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { draftIds } from '../../../utils/keyId'
import { vmMap } from '../../../utils/vmMap'
import commonMixin from '../../../mixins/common'
import DialogExamples from './DialogExamples'

export default {
  name: 'AddComponent',
  components: {
    DialogExamples
  },
  mixins: [commonMixin],
  computed: {
    ...mapGetters('nodes', ['isRootForm', 'theRootForm'])
  },
  methods: {
    addTemplate(template) {
      this.cleanFormButtons(template)
      draftIds.appendIdNested(template)
      this.innerChildren = [template]
    },
    cleanFormButtons(template) {
      const rootForm = this.theRootForm(this.id)

      if (rootForm && template.tag === 'form-generator') {
        const vm = vmMap[rootForm.id]

        template.children = template.children.filter(x => {
          const tag = x.children[0].tag
          if (tag === 'form-submit') {
            return !vm.button.submit
          } else if (tag === 'form-reset') {
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
