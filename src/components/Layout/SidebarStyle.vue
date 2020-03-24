<template>
  <el-form size="mini" label-width="125px">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="Border" name="1">
        <border :computed-style="computedStyle" @change="assignStyles"/>
      </el-collapse-item>

      <el-collapse-item name="2">
        <template slot="title">
          <span class="m-r-10">Corner</span>
          <el-checkbox v-model="isCornerSeparate">Separate</el-checkbox>
        </template>
        
        <corner-part v-if="isCornerSeparate" :computed-style="computedStyle" @change="assignStyles" />
        <corner-all v-else :computed-style="computedStyle" @change="assignStyles" />
      </el-collapse-item>

      <el-collapse-item name="3">
        <template slot="title">
          <span class="m-r-10">Margin</span>
          <el-checkbox v-model="isMarginSeparate">Separate</el-checkbox>
        </template>
  
        <margin-part v-if="isMarginSeparate" :computed-style="computedStyle" @change="assignStyles" />
        <margin-all v-else :computed-style="computedStyle" @change="assignStyles" />
      </el-collapse-item>

      <el-collapse-item name="4">
        <template slot="title">
          <span class="m-r-10">Padding</span>
          <el-checkbox v-model="isPaddingSeparate">Separate</el-checkbox>
        </template>
  
        <padding-part v-if="isPaddingSeparate" :computed-style="computedStyle" @change="assignStyles" />
        <padding-all v-else :computed-style="computedStyle" @change="assignStyles" />
      </el-collapse-item>

      <el-collapse-item title="Dimension" name="5">
        <dimension :computed-style="computedStyle" @change="assignStyles" />
      </el-collapse-item>

      <el-collapse-item title="Effect" name="6">
        <effect :computed-style="computedStyle" @change="assignStyles" />
      </el-collapse-item>

      <el-collapse-item title="Transform" name="7">
        <transform :computed-style="computedStyle" @change="assignStyles" />
      </el-collapse-item>

      <el-collapse-item title="Shadow" name="8">
        <box-shadows :computed-style="computedStyle" @change="assignStyles" />
      </el-collapse-item>
    </el-collapse>
  </el-form>
</template>

<script>
// 永遠只會從EditBar裡面用bus.emit('currentSidebar')傳原始 style 過來
import Border from '../CssEditor/Border'
import CornerAll from '../CssEditor/CornerAll'
import CornerPart from '../CssEditor/CornerPart'
import MarginAll from '../CssEditor/MarginAll'
import MarginPart from '../CssEditor/MarginPart'
import PaddingAll from '../CssEditor/PaddingAll'
import PaddingPart from '../CssEditor/PaddingPart'
import Dimension from '../CssEditor/Dimension'
import Effect from '../CssEditor/Effect'
import Transform from '../CssEditor/Transform'
import Background from '../CssEditor/Background'
import BoxShadows from '../CssEditor/BoxShadows'
import Css from '../CssEditor/Css'
import Style from '../CssEditor/Style'

import { getComputedStyle, assignStyles } from '../../utils/vmMap'

export default {
  name: 'SidebarSettings',
  components: {
    Border,
    Background,
    MarginAll,
    MarginPart,
    PaddingAll,
    PaddingPart,
    Dimension,
    CornerAll,
    CornerPart,
    Css,
    Effect,
    Transform,
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
    return {
      isCornerSeparate: true,
      isMarginSeparate: true,
      isPaddingSeparate: true,
      openedMenu: null,
      activeNames: null
    }
  },
  computed: {
    computedStyle() {
      return getComputedStyle(this.id)
    }
  },
  methods: {
    assignStyles(styles) {
      assignStyles(this.id, styles)
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
