<template>
  <el-aside width="400px">
    <el-menu>
      <el-submenu
        v-for="(vNode, index) in vNodes"
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
            :sort="false">
            <el-menu-item
              v-for="(component, componentIndex) in vNode.components"
              :key="`${index}-${componentIndex}`"
              :index="`${index}-${componentIndex}`"
            >
              <render-node :dom="component" />
            </el-menu-item>
          </draggable>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import RenderNode from './RenderNode'
;``
export default {
  name: 'SidebarTemplates',
  components: {
    RenderNode
  },
  computed: {
    ...mapState('templates', ['vNodes'])
  },
  methods: {
    ...mapActions('content', ['clone'])
  }
}
</script>

<style scoped lang="scss">
.el-menu-item:focus,
.el-menu-item:hover {
  background-color: inherit;
}
.el-menu {
  @include calc-vh(min-height, '100vh');
}
</style>
