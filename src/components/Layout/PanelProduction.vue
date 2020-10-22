<template>
  <div
    :style="{ height }"
    class="fake-transform"
  >
    <art-board
      v-if="rootComponentSetId"
      :id="rootComponentSetId"
    />
  </div>
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
  computed: {
    height() {
      // must need to limit height here, otherwise artBoard will cause vh loop increase
      if (this.$route.meta.noNavbar) {
        return 'calc(100vh - var(--vh-offset, 0px))'
      }
      else {
        return 'calc(100vh - 50px - var(--vh-offset, 0px))'
      }
    }
  },
  async created() {
    this.INIT_NODE_STORE()
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
      'INIT_NODE_STORE',
      'SET_NODES_TO_MAP',
      'SET_EDITING_COMPONENT_SET_ID'
    ]),
    ...mapMutations('mode', ['SET_PRODUCTION_MODE'])
  }
}
</script>
