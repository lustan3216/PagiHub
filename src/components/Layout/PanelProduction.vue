<template>
  <art-board
    v-if="rootComponentSetId"
    :id="rootComponentSetId"
  />
</template>

<script>
import { mapMutations } from 'vuex'
import { getComponentSetPublicChildren } from '@/api/node'
import ArtBoard from '@/components/Layout/ArtBoard'

export default {
  name: 'PanelProduction',
  components: {
    ArtBoard
  },
  props: ['firstPath', 'secondPath', 'thirdPath'],
  data() {
    return {
      rootComponentSetId: null
    }
  },
  async created() {
    this.SET_PRODUCTION_MODE()

    const { userLabel, projectLabel, componentSetLabel } = this.$route.params
    const { privateLinkToken } = this.$route.query
    const {
      data: { componentSet, data: nodes }
    } = await getComponentSetPublicChildren({
      userLabel: userLabel || this.firstPath,
      projectLabel: projectLabel || this.secondPath,
      componentSetLabel: componentSetLabel || this.thirdPath,
      privateLinkToken
    })

    if (nodes.length) {
      this.SET_EDITING_COMPONENT_SET_ID(componentSet.id)
      this.rootComponentSetId = componentSet.id
      this.SET_NODES_TO_MAP({ nodes: [componentSet] })
      this.SET_NODES_TO_MAP({
        nodes,
        rootComponentSetId: componentSet.id
      })
    }
  },
  methods: {
    ...mapMutations('node', [
      'SET_NODES_TO_MAP',
      'SET_EDITING_COMPONENT_SET_ID'
    ]),
    ...mapMutations('mode', ['SET_PRODUCTION_MODE'])
  }
}
</script>
