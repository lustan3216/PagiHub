<template>
  <controller-layer
    v-if="firstChild"
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
import nodeMixin from '@/components/Templates/mixins/node'
import childrenMixin from '@/components/Templates/mixins/children'
import { ID, MASTER_ID } from '@/const'
import { componentSetInstanceIds } from '@/utils/nodeId'

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
  mixins: [nodeMixin, childrenMixin], // nodeMixin needs to deal with vmMap
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

        this.getComponentSet(this[ID])
      },
      immediate: true
    }
  },
  created() {
    const masterID = this.componentsMap[this.id][MASTER_ID]
    if (masterID) {
      componentSetInstanceIds.add(this.rootComponentSetId, this[ID])

      if (!this.componentsMap[masterID]) {
        this.getComponentSet(masterID)
      }
    }
  },
  methods: {
    ...mapActions('component', ['getComponentSet'])
  }
}
</script>
