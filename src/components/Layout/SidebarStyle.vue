<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="Border" name="1">
        <border :computed-style="computedStyle" />
      </el-collapse-item>

      <el-collapse-item title="Corner" name="2">
        <corner :computed-style="computedStyle" />
      </el-collapse-item>

      <el-collapse-item title="Space" name="3">
        <margin :computed-style="computedStyle" />
        <padding :computed-style="computedStyle" />
      </el-collapse-item>

      <el-collapse-item title="Dimension" name="5">
        <dimension :computed-style="computedStyle" />
      </el-collapse-item>

      <el-collapse-item title="Effect" name="6">
        <effect :computed-style="computedStyle" />
      </el-collapse-item>

      <el-collapse-item title="Shadow" name="7">
        <template slot="title">
          Shadow
          <el-button-group @click.stop>
            <el-button icon="el-icon-plus" size="mini" />
            <el-button icon="el-icon-delete" size="mini" />
          </el-button-group>
        </template>

        <box-shadows :computed-style="computedStyle" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
// 永遠只會從EditBar裡面用bus.emit('currentSidebar')傳原始 style 過來
import Border from '../CssEditor/Border'
import Corner from '../CssEditor/Corner'
import Margin from '../CssEditor/Margin'
import Padding from '../CssEditor/Padding'
import Dimension from '../CssEditor/Dimension'
import Effect from '../CssEditor/Effect'

import Background from '../CssEditor/Background'
import BoxShadows from '../CssEditor/BoxShadows'
import Css from '../CssEditor/Css'
import Style from '../CssEditor/Style'
import { vmMap } from '../../utils/vmMap'

export default {
  name: 'SidebarSettings',
  components: {
    Border,
    Background,
    Margin,
    Padding,
    Dimension,
    Corner,
    Css,
    Effect,
    BoxShadows,
    Style
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    const vm = vmMap[this.id]
    return {
      computedStyle: window.getComputedStyle(vm.$el),
      openedMenu: null,
      activeNames: null
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
  },
  methods: {
    assignStyles(styles) {
      this.vm().assignStyles(styles)
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
