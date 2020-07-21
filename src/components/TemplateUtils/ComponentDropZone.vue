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
    ...mapState('example', ['basicExamplesMap'])
  },
  methods: {
    addComponent(event) {
      const id = event.dataTransfer.getData('id')
      this._addNodesToParentAndRecord(this.basicExamplesMap[id])
    }
  }
}
</script>

<style scoped lang="scss"></style>
