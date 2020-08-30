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
import { vmAppend } from '@/utils/vmMap'

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
  watch: {
    [`node.${[MASTER_ID]}`](masterID) {
      if (masterID) {
        if (!this.componentsMap[masterID]) {
          this.getComponentSet(masterID)
        }
      }
    }
  },
  created() {
    this.getComponentSetChildren(this[ID])
  },
  mounted() {
    // Don't put in created to prevent some component fail before mount
    if (this.isDraftMode) {
      vmAppend(this, this.isExample)
    }
  },
  methods: {
    ...mapActions('node', ['getComponentSetChildren'])
  }
}
</script>
