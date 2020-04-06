<template>
  <el-button type="primary" style="margin-left: 16px;" @click="drawer = true">
    Drawer
    <portal :disabled="isExample" to="Root">
      <el-drawer
        v-bind="innerProps"
        :class="{ hideHeader }"
        :visible.sync="drawer"
      >
        <grid-generator :id="id" />
      </el-drawer>
    </portal>
  </el-button>
</template>

<script>
import { Drawer } from 'element-ui'
import nodeMixin from '../../mixins/node'
import childrenMixin from '../../mixins/children'
import GridGenerator from './GridGenerator'
import { defaultSetting } from '../../settings/drawer'

export default {
  defaultSetting,
  name: 'Drawer',
  components: {
    ElDrawer: Drawer,
    GridGenerator
  },
  mixins: [nodeMixin, childrenMixin],
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
  }
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
::v-deep.hideHeader > div > div > .el-drawer__header {
  display: none;
}
</style>
