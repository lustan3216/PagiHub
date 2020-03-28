<template>
  <el-form size="mini" label-position="top">
    <class-state/>
    
    <dimension
      :computed-style="computedStyle"
      @change="assignStyles"
    />
    
    <corner
      :computed-style="computedStyle"
      @change="assignStyles"
    />
    
    <!--<margin-->
    <!--:computed-style="computedStyle"-->
    <!--@change="assignStyles"-->
    <!--/>-->
  
    <padding
      :computed-style="computedStyle"
      @change="assignStyles"
    />
  
    <border
      :computed-style="computedStyle"
      @change="assignStyles"
    />
  
    <background
      :computed-style="computedStyle"
      @change="assignStyles"
    />
    
    <el-collapse v-model="activeNames">

      <el-collapse-item title="Shadow" name="6">
        <box-shadows :computed-style="computedStyle" @change="assignStyles" />
      </el-collapse-item>
      
      <el-collapse-item title="Effect" name="7">
        <effect :computed-style="computedStyle" @change="assignStyles" />
      </el-collapse-item>
      
    </el-collapse>
  
    <style-block :plan-style="planStyle" @change="assignStyles" />
  </el-form>
</template>

<script>
// 永遠只會從EditBar裡面用bus.emit('currentSidebar')傳原始 style 過來
import ClassState from '../CssEditor/ClassState'
import Border from '../CssEditor/Border'
import Corner from '../CssEditor/Corner'
import Margin from '../CssEditor/Margin'
import Padding from '../CssEditor/Padding'
import Dimension from '../CssEditor/Dimension'
import Effect from '../CssEditor/Effect'
import Background from '../CssEditor/Background'
import BoxShadows from '../CssEditor/BoxShadows'
import StyleBlock from '../CssEditor/StyleBlock'
import Transition from '../CssEditor/Transition'
import { mapGetters } from 'vuex'
import { getComputedStyle, assignStyles, getPlanStyle } from '../../utils/vmMap'

const attributes = [
  'width', 'minWidth', 'maxWidth',
  'height', 'minHeight', 'maxHeight',
  'boxShadow', 'filter',
  'borderRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius', 'borderTopLeftRadius',
  'borderTop', 'borderBottom', 'borderRight', 'borderLeft',
  'margin', 'marginTop', 'marginBottom', 'marginRight', 'marginLeft',
  'padding', 'paddingTop', 'paddingBottom', 'paddingRight', 'paddingLeft'
]

export default {
  name: 'SettingsStyle',
  components: {
    ClassState,
    Border,
    Background,
    Margin,
    Padding,
    Dimension,
    Corner,
    Effect,
    BoxShadows,
    StyleBlock,
    Transition
  },
  data() {
    return {
      klass: '',
      activeNames: ''
    }
  },
  computed: {
    ...mapGetters('app', ['selectedComponentId']),
    computedStyle() {
      const styles = getComputedStyle(this.selectedComponentId)
  
      return attributes.reduce((all, attr) => {
        all[attr] = styles[attr]
        return all
      }, {})
    },
    planStyle() {
      return getPlanStyle(this.selectedComponentId) || ''
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
::v-deep {
  .el-col{
    text-align: center;
  }
  .el-form-item {
    text-align: center;
  }
  .el-form-item__label{
    padding: 0;
    top: 32px;
    font-size: 12px;
    line-height: 12px;
    white-space: nowrap;
    transform: translateX(-50%);
    position: absolute;
  }
}
</style>
