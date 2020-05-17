<template>
  <async-component
    v-if="firstChild"
    :tag="firstChild.tag"
    :id="firstChild.id"
  />
</template>

<script>
import AsyncComponent from './AsyncComponent'
import nodeMixin from '@/components/Templates/mixins/node'
import childrenMixin from '@/components/Templates/mixins/children'
export default {
  name: 'ComponentSet',
  components: {
    AsyncComponent
  },
  mixins: [nodeMixin, childrenMixin],
  computed: {
    firstChild() {
      return this.innerChildren[0]
    }
  }
}
</script>
