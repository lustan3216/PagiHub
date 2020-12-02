<template>
  <el-form
    :disabled="!selectedComponentNodes.length"
    label-position="top"
  >
    <template v-if="!hasBackground">
      <align />

      <dimension />

      <item-hidden-controller />

      <portal-target
        name="Rotate"
        slim
      />

      <opacity />

      <padding />

      <radius />

      <portal-target name="FontStyle" />

      <stack />

      <position />

      <!--      <el-divider content-position="left">APPEARANCE</el-divider>-->

      <!--      <overflow />-->

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
import Position from './EditorStyle/Position'
import Transitions from './EditorStyle/Transitions'
import ItemHiddenController from './EditorStyle/ItemHiddenController'
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
    Effect,
    Overflow,
    BoxShadow,
    Transitions,
    TransformOrigin,
    Transform,
    Stack,
    ItemHiddenController
  },
  props: {
    // styles: {
    //   type: Object,
    //   default: () => ({})
    // },
    // props: {
    //   type: Object,
    //   default: () => ({})
    // },
    // grid: {
    //   type: Object,
    //   default: () => ({})
    // }
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
      return this.selectedComponentNodes.find(node => isBackground(node))
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
