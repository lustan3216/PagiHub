<template>
  <browser-window>
    <grid-generator
      :id="id"
      :parent-id="parentId"
      :children="innerChildren" />
  </browser-window>
</template>

<script>
import clone from 'clone'
import GridGenerator from '../Templates/GridGenerator'
import childrenMixin from '../../mixins/children'
import commonMixin from '../../mixins/common'
import BrowserWindow from '../BrowserWindow'
import { appendNestedIds } from '../../utils/keyId'
import { gridGenerator as templateGridGenerator } from '../../templates'

export default {
  name: 'BoardWebsite',
  components: {
    GridGenerator,
    BrowserWindow
  },
  mixins: [childrenMixin, commonMixin],
  created() {
    const cloned = clone(templateGridGenerator.children)
    appendNestedIds(cloned)
    this.innerChildren = cloned
  }
}
</script>

<style lang="scss" scoped>
.edit-area {
  @include calc-vh(min-height, '100vh - 135px');
  border: none;
}
</style>
