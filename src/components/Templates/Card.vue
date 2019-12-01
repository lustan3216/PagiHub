<template>
  <div class="h-100 flex-center">
    <el-card v-bind="innerSettings('basic')" :style="innerStyles">
      <inner-grid-generator ref="grid" :id="id" :children="children" />
    </el-card>
  </div>
</template>

<script>
import childrenMixin from '../../mixins/children'
import commonMixin from '../../mixins/common'
import InnerGridGenerator from './Common/InnerGridGenerator'
import settings from '../../settings/card'

export default {
  settingsTemplate: settings(),
  name: 'Card',
  components: {
    InnerGridGenerator
  },
  mixins: [childrenMixin, commonMixin],
  computed: {
    firstChild() {
      return this.innerChildren[0]
    }
  },
  watch: {
    innerChildren(value) {
      this.$refs.grid.updateChildren(value)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep.el-card {
  height: calc(100% - 20px);
  width: calc(100% - 20px);
  & > .el-card__body {
    padding: 0;
    height: 100%;
  }
}
</style>
