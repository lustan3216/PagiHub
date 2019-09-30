<template>
  <sidebar>
    <el-menu>
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

        <el-menu-item
          v-for="(component, componentIndex) in vNode.components"
          :index="`${index}-${componentIndex}`"
          :key="`${index}-${componentIndex}`"
          style="height: 60%;"
        >
          <!-- here will have multi render deu to el-menu-item-group bug--->
          <component
            v-bind="component.props"
            :is="component.tag"
            :key="`${index}-${componentIndex}`"
            :children="component.children"
          />
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </sidebar>
</template>

<script>
// 永遠只會從EditBar裡面用bus.emit('currentSidebar')傳原始 style 過來
import Sidebar from './Sidebar'
import Border from '../CssEditor/Border'
import Background from '../CssEditor/Background'
import Corner from '../CssEditor/Corner'
import Css from '../CssEditor/Css'
import Effect from '../CssEditor/Effect'
import Position from '../CssEditor/Position'
import Shadow from '../CssEditor/Shadow'
import Spacing from '../CssEditor/Spacing'
import Dimension from '../CssEditor/Dimension'

export default {
  name: 'SidebarSettings',
  components: {
    Sidebar,
    Border,
    Background,
    Spacing,
    Dimension,
    Corner,
    Css,
    Effect,
    Position,
    Shadow
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    styles: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      openedMenu: null
    }
  },
  computed: {
    templates() {
      return [
        {
          type: 'Border',
          icon: 'el-icon-message',
          components: [
            {
              tag: 'Border'
            }
          ]
        },
        {
          type: 'Spacing',
          icon: 'el-icon-message',
          components: [
            {
              tag: 'Spacing'
            }
          ]
        },
        {
          type: 'Dimension',
          icon: 'el-icon-message',
          components: [
            {
              tag: 'Dimension'
            }
          ]
        },
        {
          type: 'Background',
          icon: 'el-icon-message',
          components: [
            {
              tag: 'Background'
            }
          ]
        },
        {
          type: 'Corner',
          icon: 'el-icon-message',
          components: [
            {
              tag: 'Corner'
            }
          ]
        },
        {
          type: 'Css',
          icon: 'el-icon-message',
          components: [
            {
              tag: 'Css'
            }
          ]
        },
        {
          type: 'Effect',
          icon: 'el-icon-message',
          components: [
            {
              tag: 'Effect'
            }
          ]
        },
        {
          type: 'Position',
          icon: 'el-icon-message',
          components: [
            {
              tag: 'Position'
            }
          ]
        },
        {
          type: 'Shadow',
          icon: 'el-icon-message',
          components: [
            {
              tag: 'Shadow'
            }
          ]
        }
      ]
    }
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.el-menu-item:focus,
.el-menu-item:hover {
  background-color: inherit;
}
.el-submenu .el-menu-item {
  height: inherit;
}
</style>
