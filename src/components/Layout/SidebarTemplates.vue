<template>
  <sidebar>
    <el-menu unique-opened>
      <el-submenu
        v-for="(vNode, index) in templates"
        :index="index.toString()"
        :key="index"
        @click.native="openedMenu = openedMenu === index ? null : index"
      >
        <template slot="title">
          <i :class="vNode.icon" />
          {{ vNode.type }}
        </template>
    
        <el-menu-item-group v-if="openedMenu === index">
          <draggable
            :value="vNode.components"
            :group="{ name: 'editableArea', pull: 'clone', put: false }"
            :clone="clone"
            :sort="false"
          >
            <el-menu-item
              v-for="(component, componentIndex) in vNode.components"
              :index="`${index}-${componentIndex}`"
              :key="`${index}-${componentIndex}`"
              style="height: 60%;"
            >
              <!-- here will have multi render deu to el-menu-item-group bug --->
              <!-- Would try to debug in the future --->
              <component
                v-bind="component.props"
                :is="component.tag"
                :id="index"
                :key="`${index}-${componentIndex}`"
                :children="component.children"
                :is-editable="false"
                class="no-click"
              />
            </el-menu-item>
          </draggable>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </sidebar>
</template>

<script>
import importTemplatesMixin from '../../mixins/importTemplates'
import clone from 'clone'
import templates from '../../templates'
import Sidebar from './Components/CustomizedSidebar'
import { appendNestedIds } from '../../utils/keyId'

export default {
  name: 'SidebarTemplates',
  components: {
    Sidebar
  },
  mixins: [importTemplatesMixin],
  data() {
    return {
      templates,
      openedMenu: null
    }
  },
  methods: {
    clone(children) {
      const cloned = clone(children)
      appendNestedIds(cloned)
      return cloned
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep > .el-carousel__container {
  height: auto;
  padding-top: 60%;
}
.el-menu-item:focus,
.el-menu-item:hover {
  background-color: inherit;
}
</style>
