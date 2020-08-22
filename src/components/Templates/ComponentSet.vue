<template>
  <async-component
    v-if="firstChild"
    :id="firstChild.id"
  />
</template>

<script>
import { mapActions } from 'vuex'
import { ID, MASTER_ID } from '@/const'
import AsyncComponent from '../TemplateUtils/AsyncComponent'
import childrenMixin from '@/components/Templates/mixins/children'
import { vmAppend, vmRemove } from '@/utils/vmMap'

export default {
  name: 'ComponentSet',
  components: {
    AsyncComponent
  },
  mixins: [childrenMixin],
  computed: {
    firstChild() {
      return this.innerChildren[0]
    }
  },
  created() {
    this.getComponentSetChildren(this[ID])

    const masterID = this.componentsMap[this.id][MASTER_ID]
    if (masterID) {
      if (!this.componentsMap[masterID]) {
        this.getComponentSet(masterID)
      }
    }
  },
  updated() {
    this.getComponentSetChildren(this[ID])
    if (this.isDraftMode) {
      vmAppend(this, this.isExample)
    }
  },
  mounted() {
    // Don't put in created to prevent some component fail before mount
    if (this.isDraftMode) {
      vmAppend(this, this.isExample)
    }
  },
  methods: {
    ...mapActions('component', ['getComponentSetChildren'])
  }
}
</script>
