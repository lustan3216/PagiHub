<template>
  <el-form
    :disabled="!selectedComponentNodes.length"
    label-position="top"
  >

    <template v-if="!hasBackground">
      <align :grid="grid"/>

      <text-editor-simple-style />

      <stack />

      <portal-target name="PanelStyles" />

      <item-hidden-controller />

      <dimension />

      <el-divider content-position="left">APPEARANCE</el-divider>

      <position />

      <!--      <overflow />-->

      <padding />

      <radius />

      <opacity />

      <portal-target
        name="Rotate"
        slim
      />

      <background-color />

      <border-all />

      <box-shadow />

      <effect />

      <transform />
    </template>

    <background-color v-else />

  </el-form>
</template>

<script>
// 永遠只會從EditBar裡面用bus.emit('currentSidebar')傳原始 style 過來
import { mapGetters, mapState } from 'vuex'
import { RadioGroup, RadioButton } from 'element-ui'
import Radius from './EditorStyle/Radius'
import Padding from './EditorStyle/Padding'
import BackgroundColor from './EditorStyle/BackgroundColor'
import Dimension from './EditorStyle/Dimension'
import Effect from './EditorStyle/Effect'
import Overflow from './EditorStyle/Overflow'
import BoxShadow from './EditorStyle/BoxShadow'
import BorderAll from './EditorStyle/BorderAll'
import Transform from './EditorStyle/Transform'
import TransformOrigin from './EditorStyle/TransformOrigin'
import Opacity from './EditorStyle/Opacity'
import Stack from './EditorStyle/Stack'
import Transitions from './EditorStyle/Transitions'
import ItemHiddenController from './EditorStyle/ItemHiddenController'
import TextEditorSimpleStyle from './EditorStyle/TextEditorSimpleStyle'
import Ratio from './EditorStyle/Ratio'
import Position from '@/components/Setup/EditorStyle/Position'
import Align from '@/components/Setup/EditorStyle/Align'
import { isBackground } from '@/utils/node'

export default {
  name: 'PanelStyles',
  components: {
    Align,
    Position,
    BackgroundColor,
    Padding,
    Radius,
    Opacity,
    BorderAll,
    Dimension,
    Ratio,
    Effect,
    Overflow,
    BoxShadow,
    Transitions,
    TransformOrigin,
    Transform,
    Stack,
    ItemHiddenController,
    TextEditorSimpleStyle,
    ElRadioGroup: RadioGroup,
    ElRadioButton: RadioButton
  },
  props: {
    styles: {
      type: Object,
      default: () => ({})
    },
    props: {
      type: Object,
      default: () => ({})
    },
    grid: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      state: 'default'
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    ...mapGetters('app', ['selectedComponentNodes']),
    hasBackground() {
      return this.selectedComponentIds.find(id => isBackground(this.nodesMap[id]))
    }
  }
}
</script>

<style scoped lang="scss">
.el-menu-item:focus,
.el-menu-item:hover {
  background-color: inherit;
}
::v-deep .el-select * {
  vertical-align: initial;
}
::v-deep {
  .el-col {
    padding-bottom: 10px;
  }
  .el-form-item {
    text-align: center;
  }
}
</style>
