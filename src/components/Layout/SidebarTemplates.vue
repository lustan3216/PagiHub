<template>
  <sidebar>
    <el-menu unique-opened>
      <el-submenu
        @click.native="openedMenu = openedMenu === index ? null : index"
        v-for="(vNode, index) in templates"
        :index="index.toString()"
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
            >
              <!-- here will have multi render deu to el-menu-item-group bug--->
              <component
                :is="component.tag"
                :editable="false"
                :children="component.children"
              />
            </el-menu-item>
          </draggable>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </sidebar>
</template>

<script>
import RenderNode from '../RenderNode'
import importTemplatesMixin from '../../mixins/importTemplates'
import Sidebar from './Sidebar'
import clone from 'clone'
import templates from '../../observable/templates'

export default {
  name: 'SidebarTemplates',
  components: {
    RenderNode,
    Sidebar
  },
  mixins: [importTemplatesMixin],
  data(){
    return {
      templates,
      openedMenu: null
    }
  },
  methods: {
    clone(node) {
      return clone(node)
    }
  }
}
</script>

<style scoped lang="scss">
.el-menu-item:focus,
.el-menu-item:hover {
  background-color: inherit;
}
/*.el-submenu .el-menu-item {*/
/*height: inherit;*/
/*}*/
</style>
