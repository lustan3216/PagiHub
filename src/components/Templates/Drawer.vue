<template>
  <portal
    v-if="visible"
    :disabled="!innerProps.toRoot"
    to="Root"
  >
    <div
      v-if="innerProps.modal && visible"
      class="v-modal"
    />
    <el-drawer
      v-mousewheel="mousewheel"
      v-bind="innerProps"
      :key="innerProps.modal"
      :append-to-body="false"
      :modal-append-to-body="false"
      :visible.sync="visible"
      :with-header="innerProps.showClose"
      :modal="false"
      :show-close="false"
    >
      <controller-layer
        v-free-style="innerStyles"
        :id="id"
        class="h-100"
      >
        <template v-slot="{ itemEditing }">
          <grid-generator-inner
            :id="id"
            :inner-props="innerProps"
            :class="{ 'no-action': !itemEditing }"
          />
        </template>

      </controller-layer>
    </el-drawer>
  </portal>
</template>

<script>
import { Drawer } from 'element-ui'
import nodeMixin from '@/components/Templates/mixins/node'
import gridGeneratorInner from './GridGeneratorInner'
import mousewheel from 'element-ui/lib/directives/mousewheel'
import { defaultSetting } from '../Setup/EditorSetting/SettingDrawer'
import ControllerLayer from '../TemplateUtils/ControllerLayer'
import { asyncGetValue } from '@/utils/tool'
import { PROPS } from '@/const'

export default {
  defaultSetting,
  name: 'Drawer',
  components: {
    ElDrawer: Drawer,
    ControllerLayer,
    gridGeneratorInner
  },
  directives: {
    mousewheel
  },
  mixins: [nodeMixin],
  data() {
    return {
      visible: false,
      theButtonVmCanClose: null
    }
  },
  computed: {
    buttonCanCloseId() {
      return this.innerProps.buttonCanCloseId
    },
    theButtonNodeCanClose() {
      return this.componentsMap[this.buttonCanCloseId]
    }
  },
  watch: {
    theButtonNodeCanClose(node) {
      // the node is deleted
      this.interactWithButton(node)
      if (!node && !this.isExample) {
        this.RECORD([
          {
            path: `${this.id}.${PROPS}.buttonCanCloseId`,
            value: undefined
          }
        ])
      }
    },
    visible(visible) {
      this.interactWithButton(visible)
    }
  },
  methods: {
    interactWithButton(visible) {
      // the child vm not mount yet even Drawer mounted.
      if (visible) {
        asyncGetValue(() => this.vmMap[this.buttonCanCloseId]).then(vm => {
          this.theButtonVmCanClose = vm
          vm.registerClickEvent(this.id, () => {
            this.visible = false
          })
        })
      } else {
        this.theButtonVmCanClose.removeClickEvent(this.id)
      }
    },
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
