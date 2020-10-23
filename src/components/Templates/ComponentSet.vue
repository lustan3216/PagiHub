<template>
  <div
    style="min-height: 100%;"
    class="h-100"
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
    this.getComponentSetChildren({
      id: this[ID],
      force: this.isExample
    })
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
