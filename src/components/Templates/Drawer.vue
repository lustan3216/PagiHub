<template>
  <portal
    :disabled="isExample"
    to="Root"
  >
    <el-drawer
      v-mousewheel="mousewheel"
      v-bind="innerProps"
      :key="innerProps.modal"
      :append-to-body="isPreviewMode || isProductionMode"
      :modal-append-to-body="false"
      :visible.sync="visible"
      :with-header="innerProps.showClose"
      class="drawer"
    >
      <controller-layer
        :id="id"
        :style="innerStyles"
        class="h-100"
      >
        <grid-generator-inner
          :id="id"
          :inner-props="innerProps"
        />
      </controller-layer>
    </el-drawer>
  </portal>
</template>

<script>
import { Drawer } from 'element-ui'
import nodeMixin from './mixins/node'
import GridGeneratorInner from './GridGeneratorInner'
import mousewheel from 'element-ui/lib/directives/mousewheel'
import { defaultSetting } from '../Setup/EditorSetting/SettingDrawer'
import ControllerLayer from '../Abstract/ControllerLayer'

export default {
  defaultSetting,
  name: 'Drawer',
  components: {
    ElDrawer: Drawer,
    ControllerLayer,
    GridGeneratorInner
  },
  directives: {
    mousewheel
  },
  mixins: [nodeMixin],
  data() {
    return {
      visible: false
    }
  },
  methods: {
    toggleVisibility() {
      this.visible = !this.visible
    },
    mousewheel(event) {
      event.preventDefault()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep.drawer .el-drawer {
  box-shadow: none;
  background-color: transparent;
  overflow: initial;
}
</style>
