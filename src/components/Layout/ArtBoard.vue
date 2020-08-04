<template>
  <div class="art-board">
    <component-set :id="id" />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import DialogInteracted from '@/components/Components/DialogInteracted'
import ComponentSet from '../TemplateUtils/ComponentSet'

export default {
  name: 'ArtBoard',
  components: {
    DialogInteracted,
    ComponentSet
  },
  provide() {
    return {
      rootComponentSetId: this.id
    }
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      canvasWidth: 0
    }
  },
  computed: {
    ...mapState('app', ['scaleRatio']),
    node() {
      return this.componentsMap[this.id]
    }
  },
  methods: {
    ...mapMutations('app', {
      appSET: 'SET'
    })
  }
}
</script>

<style scoped lang="scss">
  .art-board {
    overflow: scroll;
    background-color: #fff;
    @include calc-vh('height', '100vh - 80px');
  }
</style>
