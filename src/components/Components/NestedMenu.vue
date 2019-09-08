<template>
  <component
    :is="node.children && node.children.length ? 'el-submenu' : 'el-menu-item'"
    :index="node.id.toString()"
    :key="node.id"
    @click.native="openedMenu = openedMenu === node.id ? null : node.id"
  >
    <template slot="title">
      <i :class="node.icon" />
      {{ node.tag }} - {{ node.id }}
      <template v-if="node.tag === 'grid-item'">
        {{ node.x }} - {{ node.y }} - {{ node.w }} - {{ node.h }}
      </template>
    </template>

    <component
      v-for="child in node.children"
      :is="child.children && child.children.length ? 'el-submenu' : 'el-menu-item'"
      :index="child.id.toString()"
      :key="child.id"
    >
      <template slot="title">
        <i :class="node.icon" />
        {{ child.tag }} - {{ child.id }}
        <template v-if="child.tag === 'grid-item'">
          / {{ child.x }} - {{ child.y }} - {{ child.w }} - {{ child.h }}
        </template>
      </template>

      <nested-menu
        v-for="node in child.children"
        :node="node" />
    </component>
  </component>
</template>

<script>
export default {
  name: 'NestedMenu',
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      openedMenu: null
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
</style>
