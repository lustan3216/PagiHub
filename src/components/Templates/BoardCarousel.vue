<template>
  <carousel
    :id="id"
    :parent-id="parentId"
    :children="innerChildren" />
</template>

<script>
import clone from 'clone'
import Carousel from '../Templates/Carousel'
import childrenMixin from '../../mixins/children'
import commonMixin from '../../mixins/common'
import { appendNestedIds } from '../../utils/keyId'
import { carousel as templateCarousel } from '../../templates'

export default {
  name: 'BoardWebsite',
  components: {
    Carousel
  },
  mixins: [childrenMixin, commonMixin],
  created() {
    if (!this.children.length) {
      const cloned = clone(templateCarousel().children)
      appendNestedIds(cloned)
      this.innerChildren = cloned
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-carousel__container {
  @include calc-vh(height, '100vh - 135px');
  border: none;
}
</style>
