<template>
  <div
    :style="innerStyles.html"
    class="wh-100"
  >
    <component-giver
      v-if="firstChild && firstChild.id"
      :id="firstChild.id"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { ID } from '@/const'
import ComponentGiver from '../TemplateUtils/ComponentGiver'
import nodeMixin from '@/components/Templates/mixins/node'
import childrenMixin from '@/components/Templates/mixins/children'
import { vmAppend } from '@/utils/vmMap'

export default {
  name: 'ComponentSet',
  components: {
    ComponentGiver
  },
  mixins: [nodeMixin, childrenMixin],
  computed: {
    firstChild() {
      return this.innerChildren[0]
    }
  },
  created() {
    this.getComponentSetChildren(this[ID])
  },
  updated() {
    this.getComponentSetChildren(this[ID])
  },
  mounted() {
    // Don't put in created to prevent some component fail before mount
    if (this.isDraftMode) {
      vmAppend(this, this.isExample)
    }
  },
  methods: {
    ...mapActions('node', ['getComponentSetChildren'])
  }
}
</script>
