<template>
  <async-component
    v-if="firstChild"
    :id="firstChild.id"
  />
</template>

<script>
import { mapActions } from 'vuex'
import store from '@/store'
import AsyncComponent from '../TemplateUtils/AsyncComponent'
import childrenMixin from '@/components/Templates/mixins/children'

export default {
  name: 'ConnectionLayer',
  provide() {
    const node = store.state.node.componentsMap[this.id]
    return {
      rootMasterId: node.rootMasterId
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
    this.getComponentSetChildren(this.node.rootMasterId)
  },
  methods: {
    ...mapActions('node', ['getComponentSetChildren'])
  }
}
</script>
