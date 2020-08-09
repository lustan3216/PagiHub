<template>
  <editor-menu-bubble :editor="editor">
    <div slot-scope="{ commands, getMarkAttrs }">

      <el-divider content-position="left">FONT</el-divider>

      <el-row
        type="flex"
        align="middle"
      >
        <el-col :span="8">
          <span class="title">Family</span>
        </el-col>
        <el-col :span="16">
          <el-select
            ref="fontFamily"
            :value="getMarkAttrs('fontFamily').fontFamily"
            @change="commands.fontFamily({ fontFamily: $event })"
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
            @change="$event => setAttribute('fontSize', $event)"
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
            @change="$event => setAttribute('letterSpacing', $event)"
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
            @change="$event => setAttribute('lineHeight', $event)"
          />
        </el-col>
      </el-row>

    </div>
  </editor-menu-bubble>
</template>

<script>
import { Divider } from 'element-ui'
import { EditorMenuBubble } from 'tiptap'
import SelectUnit from '@/components/Components/SelectUnit'
import ColorPicker from '@/components/Components/ColorPicker'

export default {
  name: 'TextEditorStyle',
  components: {
    EditorMenuBubble,
    SelectUnit,
    ColorPicker,
    ElDivider: Divider
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
