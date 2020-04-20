<template>
  <el-form label-position="top">
    <!--    <class-state :computed-style="computedStyle" />-->
    <node-info
      v-if="theOnlySelectedComponentId"
      :id="theOnlySelectedComponentId"
      class="text-center m-b-10 block"
      show-family
    />

    <portal-target
      name="PanelStyles"
      slim
    />

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

    <!--    <background-->
    <!--      :computed-style="computedStyle"-->
    <!--      @change="assignStyles"-->
    <!--    />-->

    <el-collapse v-model="activeNames">
      <el-collapse-item
        title="Shadow"
        name="6"
      >
        <box-shadows
          :computed-style="computedStyle"
          @change="assignStyles"
        />
      </el-collapse-item>

      <el-collapse-item
        title="Effect"
        name="7"
      >
        <effect
          :computed-style="computedStyle"
          @change="assignStyles"
        />
      </el-collapse-item>
    </el-collapse>

    <style-block
      :plan-style="planStyle"
      @change="assignStyles"
    />
  </el-form>
</template>

<script>
// 永遠只會從EditBar裡面用bus.emit('currentSidebar')傳原始 style 過來
import ClassState from './EditorStyle/ClassState'
import Border from './EditorStyle/Border'
import Corner from './EditorStyle/Corner'
import Margin from './EditorStyle/Margin'
import Padding from './EditorStyle/Padding'
import Dimension from './EditorStyle/Dimension'
import Effect from './EditorStyle/Effect'
import Background from './EditorStyle/Background'
import BoxShadows from './EditorStyle/BoxShadows'
import StyleBlock from './EditorStyle/StyleBlock'
import Transition from './EditorStyle/Transition'
import { mapGetters } from 'vuex'
import { getComputedStyle, assignStyles, getPlanStyle } from '@/utils/vmMap'
import NodeInfo from '@/components/TemplateUtils/NodeInfo'

const attributes = [
  'width',
  'minWidth',
  'maxWidth',
  'height',
  'minHeight',
  'maxHeight',
  'boxShadow',
  'filter',
  'borderRadius',
  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius',
  'borderTopLeftRadius',
  'borderTop',
  'borderBottom',
  'borderRight',
  'borderLeft',
  'margin',
  'marginTop',
  'marginBottom',
  'marginRight',
  'marginLeft',
  'padding',
  'paddingTop',
  'paddingBottom',
  'paddingRight',
  'paddingLeft'
]

export default {
  name: 'PanelStyles',
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
    Transition,
    NodeInfo
  },
  data() {
    return {
      klass: '',
      activeNames: ''
    }
  },
  computed: {
    ...mapGetters('app', ['theOnlySelectedComponentId']),
    computedStyle() {
      const styles = getComputedStyle(this.theOnlySelectedComponentId)

      return attributes.reduce((all, attr) => {
        all[attr] = styles[attr]
        return all
      }, {})
    },
    planStyle() {
      return getPlanStyle(this.theOnlySelectedComponentId) || ''
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
  .el-col {
    text-align: center;
    position: relative;
    padding-bottom: 22px;
  }
  .el-form-item {
    text-align: center;
  }
  .el-form-item__label {
    padding: 0;
    top: 32px;
    font-size: 12px;
    line-height: 12px;
    white-space: nowrap;
    transform: translateX(-50%);
    position: absolute;
    left: 50%;
  }
}
</style>
