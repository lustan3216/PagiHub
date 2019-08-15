<template>
  <el-aside width="400px">
    <el-form>
      <el-form-item
        v-for="(value, name) in $observable.nodeForSetting.$options.props"
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
  methods: {
    propsValue(name) {
      console.log(3, this.$observable.nodeForSetting.observableNode._data.props[name])
      return this.$observable.nodeForSetting.observableNode._data.props[name]
    },
    onChange(name, value) {
      const type = this.$observable.nodeForSetting.$options.props[name].type
      debugger
      // this.$observable.nodeForSetting.observableNode._data =
      this.$set(this.$observable.content[0].data.props, 'items', 1)

      // this.$forceUpdate()
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
