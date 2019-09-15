<template>
  <grid-generator
    :id="id"
    :parent-id="parentId"
    :children="innerChildren" />
</template>

<script>
import { mapGetters } from 'vuex'
import clone from 'clone'
import GridGenerator from '../Templates/GridGenerator'
import childrenMixin from '../../mixins/children'
import commonMixin from '../../mixins/common'
import { appendNestedIds } from '../../utils/keyId'
import { gridGenerator as templateGridGenerator } from '../../templates'

export default {
  name: 'BoardWebsite',
  components: {
    GridGenerator
  },
  mixins: [childrenMixin, commonMixin],
  computed: {
    ...mapGetters('nodes', ['hasRootNode'])
  },
  created() {
    if (!this.children.length) {
      const cloned = clone(templateGridGenerator().children)
      appendNestedIds(cloned)
      this.innerChildren = cloned
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-area {
  @include calc-vh(min-height, '100vh - 135px');
  border: none;
}
</style>
