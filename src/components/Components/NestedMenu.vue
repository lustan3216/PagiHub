<template>
  <component
    :is="hasChildren(node) ? 'el-submenu' : 'el-menu-item'"
    :index="node.id.toString()"
    :key="node.id"
    :class="{ 'is-activated': node.id === activeId }"
    @click.native.stop="$emit('onClick', node.id)"
  >
    <template slot="title">
      <i :class="node.icon" />
      {{ node.tag }} - {{ node.id }}
      <template v-if="node.tag === 'grid-item'">
        {{ node.x }} - {{ node.y }} - {{ node.w }} - {{ node.h }}
      </template>
    </template>

    <nested-menu
      v-for="child in node.children"
      :node="child"
      :active-id="activeId"
      @onClick="$emit('onClick', $event)"
    />
  </component>
</template>

<script>
export default {
  name: 'NestedMenu',
  props: {
    node: {
      type: Object,
      required: true
    },
    activeId: {
      type: Number
    }
  },
  methods: {
    hasChildren(node) {
      return node.children && node.children.length
    }
  }
}
</script>

<style scoped lang="scss">
.functions {
  top: -35px;
  right: 10px;
  z-index: 100;
  position: absolute;
  width: 220px;
}
.outer {
  position: relative;
}
::v-deep.el-menu-item.is-activated,
::v-deep.el-submenu.is-activated > .el-submenu__title {
  color: #409eff;
}
</style>
