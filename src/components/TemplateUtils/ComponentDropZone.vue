<template>
  <div
    @drop.stop="addComponent"
    @dragover.prevent
  >
    <slot />
  </div>
</template>

<script>
import { getNode } from '@/utils/node'
import { mapMutations } from 'vuex'
import childrenMixin from '@/components/Templates/mixins/children'

export default {
  name: 'ComponentDropZone',
  mixins: [childrenMixin],
  methods: {
    ...mapMutations('component', ['SET_EDITING_COMPONENT_SET_ID']),
    addComponent(event) {
      const id = event.dataTransfer.getData('id')
      this._addNodesToParentAndRecord(getNode(id))
    }
  }
}
</script>

<style scoped lang="scss"></style>
