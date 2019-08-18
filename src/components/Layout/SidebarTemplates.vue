<template>
  <sidebar>
    <el-menu>
      <el-submenu
        v-for="(vNode, index) in $observable.templates"
        :index="index.toString()"
        :key="vNode.type">
        <template slot="title">
          <i :class="vNode.icon" />
          {{ vNode.type }}
        </template>

        <el-menu-item-group>
          <draggable
            :list="vNode.components"
            :group="{ name: 'people', pull: 'clone', put: false }"
            :clone="clone"
            :sort="false"
          >
            <el-menu-item
              v-for="(component, componentIndex) in vNode.components"
              :key="`${index}-${componentIndex}`"
              :index="`${index}-${componentIndex}`"
            >
              <render-static-node :dom="component" />
            </el-menu-item>
          </draggable>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </sidebar>
</template>

<script>
import RenderStaticNode from '../RenderStaticNode'
import importTemplatesMixin from '../../mixins/importTemplates'
import Sidebar from './Sidebar'

export default {
  name: 'SidebarTemplates',
  components: {
    RenderStaticNode,
    Sidebar
  },
  mixins: [importTemplatesMixin],
  methods: {
    clone(node) {
      return {
        tag: 'wrapper',
        children: [JSON.parse(JSON.stringify(node))]
      }
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
