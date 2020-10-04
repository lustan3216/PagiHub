<template>
  <art-board
    v-if="rootComponentSetId"
    :id="rootComponentSetId"
  />
</template>

<script>
import { mapMutations } from 'vuex'
import { getComponentSetPublicChildren } from "@/api/node"
import ArtBoard from "@/components/Layout/ArtBoard"

export default {
  name: 'PanelProduction',
  components: {
    ArtBoard
  },
  data() {
    return {
      loadedList: {},
      rootComponentSetId: null
    }
  },
  async created() {
    this.SET_PRODUCTION_MODE()
    if (this.loadedList[this.$route.path]) {
      return
    }
    this.loadedList[this.$route.path] = true

    const { userLabel, projectLabel, componentSetLabel } = this.$route.params
    const { componentSet, data: nodes } = await getComponentSetPublicChildren({
      userLabel,
      projectLabel,
      componentSetLabel
    })

    if (nodes.length) {
      this.SET_EDITING_COMPONENT_SET_ID(componentSet.id)
      this.rootComponentSetId = componentSet.id
      this.SET_NODES_TO_MAP({
        nodes: [componentSet]
      })
      this.SET_NODES_TO_MAP({
        nodes,
        rootComponentSetId: componentSet.id
      })
    }
  },
  methods: {
    ...mapMutations('node', ['SET_NODES_TO_MAP', 'SET_EDITING_COMPONENT_SET_ID']),
    ...mapMutations('mode', ['SET_PRODUCTION_MODE'])
  }
}
</script>
