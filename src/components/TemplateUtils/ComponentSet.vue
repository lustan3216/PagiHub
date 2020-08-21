<template>
  <async-component
    v-if="firstChild"
    :id="firstChild.id"
  />
</template>

<script>
import { mapActions } from 'vuex'
import { ID, MASTER_ID } from '@/const'
import AsyncComponent from './AsyncComponent'
import childrenMixin from '@/components/Templates/mixins/children'
import { vmAppend } from '@/utils/vmMap'

export default {
  name: 'ComponentSet',
  provide() {
    return {
      componentSetId: this.id
    }
  },
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
  },
  mounted() {
    // Don't put in created to prevent some component fail before mount
    if (this.isDraftMode && !this.isExample) {
      vmAppend(this)
    }
  },
  methods: {
    ...mapActions('component', ['getComponentSetChildren'])
  }
}
</script>
