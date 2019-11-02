<template>
  <el-menu @open="openedMenu = +$event">
    <el-submenu
      v-for="(vNode, index) in templates"
      :index="index.toString()"
      :key="index">
      <template slot="title">
        <i :class="vNode.icon" />
        {{ vNode.type }}
      </template>

      <el-menu-item
        v-for="(component, componentIndex) in vNode.components"
        :index="`${index}-${componentIndex}`"
        :key="`${index}-${componentIndex}`"
        class="menu-item"
      >
        <!-- here will have multi render deu to el-menu-item-group bug--->
        <component
          v-if="openedMenu === index"
          v-bind="component.props"
          :id="id"
          :is="component.tag"
          :key="`${index}-${componentIndex}`"
          :children="component.children"
        />
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
// 永遠只會從EditBar裡面用bus.emit('currentSidebar')傳原始 style 過來
import Border from '../CssEditor/Border'
import Background from '../CssEditor/Background'
import Corner from '../CssEditor/Corner'
import Css from '../CssEditor/Css'
import Effect from '../CssEditor/Effect'
import Position from '../CssEditor/Position'
import Shadow from '../CssEditor/Shadow'
import Spacing from '../CssEditor/Spacing'
import Dimension from '../CssEditor/Dimension'
import Style from '../CssEditor/Style'

export default {
  name: 'SidebarSettings',
  components: {
    Border,
    Background,
    Spacing,
    Dimension,
    Corner,
    Css,
    Effect,
    Position,
    Shadow,
    Style
  },
  props: {
    id: {
      type: Number,
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
          type: 'Style',
          icon: 'el-icon-message',
          components: [
            {
              tag: 'Style'
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
  }
}
</script>

<style scoped lang="scss">
.el-menu-item:focus,
.el-menu-item:hover {
  background-color: inherit;
}
.menu-item {
  padding-left: 15px !important;
  padding-right: 15px !important;
}
::v-deep .el-select * {
  vertical-align: initial;
}
</style>
