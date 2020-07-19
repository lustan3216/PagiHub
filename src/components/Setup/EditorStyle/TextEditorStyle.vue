<template>
  <editor-menu-bubble :editor="editor">
    <div slot-scope="{ commands, getMarkAttrs }">
      <el-row
        :gutter="5"
        type="flex"
        class="menubar"
      >
        <el-col :span="12">
          <el-select
            ref="fontFamily"
            :value="getMarkAttrs('fontFamily').fontFamily"
            @change="commands.fontFamily({ fontFamily: $event })"
          />
          <span class="el-form-item__label">Font Family</span>
        </el-col>

        <el-col :span="4">
          <color-picker
            :value="getMarkAttrs('color').color"
            show-alpha
            @change="commands.color({ color: $event })"
          />
          <span class="el-form-item__label">Font Color</span>
        </el-col>

        <el-col :span="8">
          <color-picker
            :value="getMarkAttrs('backgroundColor').backgroundColor"
            show-alpha
            @change="commands.backgroundColor({ backgroundColor: $event })"
          />
          <span class="el-form-item__label">Font Background</span>
        </el-col>
      </el-row>

      <el-row
        :gutter="5"
        type="flex"
        class="menubar"
      >
        <el-col :span="8">
          <select-unit
            ref="fontSize"
            :value="getMarkAttrs('fontSize').fontSize"
            @change="$event => setAttribute('fontSize', $event)"
          />
          <span class="el-form-item__label">Font Size</span>
        </el-col>

        <el-col :span="8">
          <select-unit
            ref="letterSpacing"
            :value="getMarkAttrs('letterSpacing').letterSpacing"
            @change="$event => setAttribute('letterSpacing', $event)"
          />
          <span class="el-form-item__label">
            Letter Spacing
          </span>
        </el-col>

        <el-col :span="8">
          <select-unit
            ref="lineHeight"
            :value="getMarkAttrs('lineHeight').lineHeight"
            @change="$event => setAttribute('lineHeight', $event)"
          />
          <span class="el-form-item__label">
            Line Height
          </span>
        </el-col>
      </el-row>
    </div>
  </editor-menu-bubble>
</template>

<script>
import { EditorMenuBubble } from 'tiptap'
import SelectUnit from '@/components/Components/SelectUnit'
import ColorPicker from '@/components/Components/ColorPicker'

export default {
  name: 'TextEditorStyle',
  components: {
    EditorMenuBubble,
    SelectUnit,
    ColorPicker
  },
  props: {
    editor: {
      type: Object,
      required: true
    }
  },
  methods: {
    setAttribute(attr, value) {
      this.editor.commands[attr]({ [attr]: value })
      this.$refs[attr].focus()
    }
  }
}
</script>

<style scoped lang="scss"></style>
