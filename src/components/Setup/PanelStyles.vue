<template>
  <el-form
    :disabled="!selectedComponentNodes.length"
    label-position="top"
  >
    <!--    <div class="m-b-10">-->
    <!--      <span class="title p-r-10">State</span>-->
    <!--      <el-radio-group-->
    <!--        v-model="state"-->
    <!--        size="mini"-->
    <!--      >-->
    <!--        <el-radio-button label="default">-->
    <!--          Default-->
    <!--        </el-radio-button>-->

    <!--        <el-radio-button label=":hover">-->
    <!--          Hover-->
    <!--        </el-radio-button>-->

    <!--        <el-radio-button label=":active">-->
    <!--          Click-->
    <!--        </el-radio-button>-->

    <!--        &lt;!&ndash;        <el-radio-button label="show">&ndash;&gt;-->
    <!--        &lt;!&ndash;          Show&ndash;&gt;-->
    <!--        &lt;!&ndash;        </el-radio-button>&ndash;&gt;-->
    <!--      </el-radio-group>-->
    <!--    </div>-->

    <portal-target name="PanelStyles" />

    <text-editor-simple-style v-if="isAllTextEditor" />

    <item-hidden-controller />

    <dimension v-if="isAllGridItem" />

    <el-divider content-position="left">STACK</el-divider>

    <position v-if="isAllGridItem" />

    <padding v-if="isAllGridItem" />

    <radius v-if="!hasTextEditor" />

    <opacity />

    <overflow v-if="isAllGridItem" />

    <portal-target
      name="Rotate"
      slim
    />

    <background-color v-if="isAllGridItem" />

    <border-all />

    <box-shadow />

    <effect />

    <transform />

    <!--      <transitions-->
    <!--        :disabled="!isDefaultState"-->
    <!--        :value="styles.transition"-->
    <!--        @change="recordStyles($event)"-->
    <!--      />-->
  </el-form>
</template>

<script>
// 永遠只會從EditBar裡面用bus.emit('currentSidebar')傳原始 style 過來
import { mapGetters } from 'vuex'
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
import Transitions from './EditorStyle/Transitions'
import ItemHiddenController from './EditorStyle/ItemHiddenController'
import TextEditorSimpleStyle from './EditorStyle/TextEditorSimpleStyle'
import Position from '@/components/Setup/EditorStyle/Position'
import { isGridItem, isTextEditor } from '@/utils/node'

export default {
  name: 'PanelStyles',
  components: {
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
    ItemHiddenController,
    TextEditorSimpleStyle,
    ElRadioGroup: RadioGroup,
    ElRadioButton: RadioButton
  },
  data() {
    return {
      state: 'default'
    }
  },
  computed: {
    ...mapGetters('app', ['selectedComponentNodes']),
    isAllGridItem() {
      const nodes = this.selectedComponentNodes.filter(node => isGridItem(node))
      const allGridItem = nodes.length === this.selectedComponentNodes.length
      return this.selectedComponentNodes.length && allGridItem
    },
    hasTextEditor() {
      const nodes = this.selectedComponentNodes.filter(node =>
        isTextEditor(node)
      )
      return nodes.length
    },
    isAllTextEditor() {
      const nodes = this.selectedComponentNodes.filter(node =>
        isTextEditor(node)
      )
      const allGridItem = nodes.length === this.selectedComponentNodes.length
      return this.selectedComponentNodes.length && allGridItem
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
