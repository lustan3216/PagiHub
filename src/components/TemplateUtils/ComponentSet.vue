<template>
  <controller-layer
    v-if="firstChild"
    :border="false"
    :id="firstChild.id"
  >
    <async-component :id="firstChild.id" />
  </controller-layer>
  <component-drop-zone
    v-else
    :id="id"
    class="wh-100"
  />
</template>

<script>
import { mapActions } from 'vuex'
import AsyncComponent from './AsyncComponent'
import ComponentDropZone from './ComponentDropZone'
import ControllerLayer from './ControllerLayer'
import childrenMixin from '@/components/Templates/mixins/children'
import { ID, MASTER_ID } from '@/const'
import { vmAppend } from '@/utils/vmMap'

export default {
  name: 'ComponentSet',
  provide() {
    return {
      componentSetId: this.id
    }
  },
  components: {
    AsyncComponent,
    ComponentDropZone,
    ControllerLayer
  },
  mixins: [childrenMixin],
  computed: {
    firstChild() {
      return this.innerChildren[0]
    }
  },
  watch: {
    firstChild: {
      handler(node) {
        if (node) {
          return
        }

        this.getComponentSetChildren(this[ID])
      },
      immediate: true
    }
  },
  created() {
    const masterID = this.componentsMap[this.id][MASTER_ID]
    if (masterID) {
      if (!this.componentsMap[masterID]) {
        this.getComponentSet(masterID)
      }
    }
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
