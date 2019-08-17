<template>
  <el-aside width="400px">
    <el-form>
      <el-form-item
        v-for="(value, name) in currentNode.$options.props"
        v-if="value.type"
        :label="name">
        <el-input
          :value="propsValue(name)"
          @input="onChange(name, $event)" />
      </el-form-item>
    </el-form>
  </el-aside>
</template>

<script>
import RenderNode from './RenderNode'

export default {
  name: 'SidebarSettings',
  components: {
    RenderNode
  },
  computed: {
    currentNode() {
      return this.$observable.nodeForSetting
    }
  },
  methods: {
    propsValue(name) {
      return this.currentNode.observableNode._data.props[name]
    },
    onChange(name, value) {
      const type = this.currentNode.$options.props[name].type
      this.$set(this.currentNode.observableNode._data.props, name, type(value))
    }
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
.el-submenu .el-menu-item {
  height: inherit;
}
</style>
