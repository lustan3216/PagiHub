<template>
  <async-component
    v-if="firstChild"
    :id="firstChild.id"
  />
  <div
    v-else
    class="wh-100"
    @drop.stop="addComponent"
    @dragover.prevent
  />
</template>

<script>
import { mapActions } from 'vuex'
import AsyncComponent from './AsyncComponent'
import nodeMixin from '@/components/Templates/mixins/node'
import childrenMixin from '@/components/Templates/mixins/children'
import { ID, MASTER_ID } from '@/const'
import { componentSetInstanceIds } from '@/utils/nodeId'
import { isComponentSet } from '@/utils/node'

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
  mixins: [nodeMixin, childrenMixin],
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
    const masterID = this.node[MASTER_ID]
    if (masterID) {
      componentSetInstanceIds.add(this.rootComponentSetId, this[ID])

      if (!this.componentsMap[masterID]) {
        this.getComponentSet(masterID)
      }
    }
  },
  methods: {
    isComponentSet,
    ...mapActions('component', ['getComponentSet']),
    addComponent(event) {
      const id = event.dataTransfer.getData('id')
      this._addNodesToParentAndRecord(this.componentsMap[id])
    }
  }
}
</script>
