<template>
  <el-button type="primary" style="margin-left: 16px;" @click="drawer = true">
    Drawer
    <portal :disabled="!isEditable" to="Root">
      <el-drawer
        :class="{ 'hide-header': hideHeader }"
        :append-to-body="false"
        :modal-append-to-body="false"
        :visible.sync="drawer"
        :direction="direction"
        size="inhert"
      >
        <inner-grid-generator ref="grid" :id="id" :children="children" />
      </el-drawer>
    </portal>
  </el-button>
</template>

<script>
import childrenMixin from '../../mixins/children'
import commonMixin from '../../mixins/common'
import InnerGridGenerator from './Common/InnerGridGenerator'
import settings from '../../settings/drawer'

export default {
  settingsTemplate: settings(),
  name: 'Drawer',
  components: {
    InnerGridGenerator
  },
  mixins: [childrenMixin, commonMixin],
  data() {
    return {
      drawer: false,
      direction: 'ttb'
    }
  },
  computed: {
    hideHeader() {
      return true
    }
  },
  watch: {
    innerChildren(value) {
      this.$refs.grid.updateChildren(value)
    }
  },
}
</script>

<style lang="scss" scoped>
.edit-area {
  height: 100%;
}
::v-deep.el-card {
  height: 94%;
  width: 94%;
  margin-left: calc(3% - 2px);
  margin-top: calc(3% - 2px);
  & > .el-card__body {
    padding: 0;
    height: 100%;
  }
}
::v-deep.hide-header > div > div > .el-drawer__header {
  display: none;
}
</style>
