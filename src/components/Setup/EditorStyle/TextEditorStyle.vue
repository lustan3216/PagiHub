<template>
  <editor-menu-bubble :editor="editor">
    <div slot-scope="{ getMarkAttrs }">

      <el-divider content-position="left">FONT</el-divider>

      <el-row
        type="flex"
        align="middle"
      >
        <el-col :span="8">
          <span class="title">
            Align
          </span>
        </el-col>
        <el-col :span="16">
          <el-button-group class="flex">
            <el-button
              class="flex1"
              plain
              icon="el-icon-s-fold"
              :type="getMarkAttrs('textAlign').textAlign === 'left' ? 'primary' : ''"
              @click="setAttribute('textAlign', 'left')"
            />
            <el-button
              class="flex1"
              plain
              icon="el-icon-s-unfold"
              :type="getMarkAttrs('textAlign').textAlign === 'center' ? 'primary' : ''"
              @click="setAttribute('textAlign', 'center')"
            />
            <el-button
              class="flex1"
              plain
              icon="el-icon-s-unfold"
              :type="getMarkAttrs('textAlign').textAlign === 'right' ? 'primary' : ''"
              @click="setAttribute('textAlign', 'right')"
            />
          </el-button-group>
        </el-col>
      </el-row>

      <el-row
        type="flex"
        align="middle"
      >
        <el-col :span="8">
          <span class="title">
            Family
            <tip>
              You can enter the font name you like. Check more from
              <span class="link" @click="openGoogleFont">Google font</span>.
              For example, You found a name "Open Sans", then just type it in.
            </tip>
          </span>
        </el-col>
        <el-col :span="16">
          <font-selector
            ref="fontFamily"
            :value="getMarkAttrs('fontFamily').fontFamily"
            @change="setAttribute('fontFamily', $event)"
          />
        </el-col>
      </el-row>

      <!--      <el-row-->
      <!--        type="flex"-->
      <!--        align="middle"-->
      <!--      >-->
      <!--        <el-col :span="8">-->
      <!--          <span class="el-form-item__label">Color</span>-->
      <!--        </el-col>-->

      <!--        <el-col :span="8">-->
      <!--          <color-picker-->
      <!--            :value="getMarkAttrs('color').color"-->
      <!--            show-alpha-->
      <!--            @change="commands.color({ color: $event })"-->
      <!--          />-->
      <!--        </el-col>-->
      <!--        <el-col :span="8">-->
      <!--          <span class="el-form-item__label">Background</span>-->
      <!--        </el-col>-->

      <!--        <el-col :span="8">-->
      <!--          <color-picker-->
      <!--            :value="getMarkAttrs('backgroundColor').backgroundColor"-->
      <!--            show-alpha-->
      <!--            @change="commands.backgroundColor({ backgroundColor: $event })"-->
      <!--          />-->
      <!--        </el-col>-->
      <!--      </el-row>-->

      <el-row
        :gutter="5"
        type="flex"
        align="middle"
      >
        <el-col :span="8"><span class="title">Size</span></el-col>
        <el-col :span="16">
          <select-unit
            ref="fontSize"
            :value="getMarkAttrs('fontSize').fontSize"
            @change="setAttribute('fontSize', $event)"
          />
        </el-col>
      </el-row>

      <el-row
        :gutter="5"
        type="flex"
        align="middle"
      >
        <el-col :span="8"><span class="title">Spacing</span></el-col>
        <el-col :span="16">
          <select-unit
            ref="letterSpacing"
            :value="getMarkAttrs('letterSpacing').letterSpacing"
            @change="setAttribute('letterSpacing', $event)"
          />
        </el-col>
      </el-row>

      <el-row
        :gutter="5"
        type="flex"
        align="middle"
      >
        <el-col :span="8"><span class="title">Height</span></el-col>
        <el-col :span="16">
          <select-unit
            ref="lineHeight"
            :value="getMarkAttrs('lineHeight').lineHeight"
            @change="setAttribute('lineHeight', $event)"
          />
        </el-col>
      </el-row>

    </div>
  </editor-menu-bubble>
</template>

<script>
import { mapMutations } from 'vuex'
import { Divider } from 'element-ui'
import { EditorMenuBubble } from 'tiptap'
import SelectUnit from '@/components/Components/SelectUnit'
import FontSelector from '@/components/Components/FontSelector'
import ColorPicker from '@/components/Components/ColorPicker'
import Tip from '@/components/Tutorial/Tip'

export default {
  name: 'TextEditorStyle',
  components: {
    EditorMenuBubble,
    SelectUnit,
    FontSelector,
    ColorPicker,
    Tip,
    ElDivider: Divider
  },
  props: {
    id: {
      type: String,
      required: true
    },
    editor: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapMutations('component', ['RECORD']),
    setAttribute(attr, value) {
      this.editor.commands[attr]({ [attr]: value })
      this.$refs[attr] && this.$refs[attr].focus && this.$refs[attr].focus()
    },
    openGoogleFont() {
      const win = window.open('https://fonts.google.com/', '_blank');
      win.focus();
    }
  }
}
</script>

<style scoped lang="scss"></style>
