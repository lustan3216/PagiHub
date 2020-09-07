<template>
  <div
    @drop.stop="addComponent"
    @dragover.prevent
  >
    <slot />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import childrenMixin from '@/components/Templates/mixins/children'

export default {
  name: 'ComponentDropZone',
  mixins: [childrenMixin],
  computed: {
    ...mapState('example', ['exampleComponentsMap'])
  },
  methods: {
    addComponent(event) {
      const id = event.dataTransfer.getData('id')
      if (id) {
        this.addNodesToParentAndRecord(this.exampleComponentsMap[id])
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
