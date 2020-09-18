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
            Family
            <tip>
              You can enter the font name you like. Check more from
              <span
                class="link"
                @click="openGoogleFont"
              >Google font</span>. For
              example, You found a name "Open Sans", then just type it in.
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
import { EditorMenuBubble } from 'tiptap'
import SelectUnit from '@/components/Components/SelectUnit'
import FontSelector from '@/components/Components/FontSelector'
import Tip from '@/components/Tutorial/Tip'

export default {
  name: 'TextEditorRichStyle',
  components: {
    EditorMenuBubble,
    SelectUnit,
    FontSelector,
    Tip
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
    setAttribute(attr, value) {
      this.editor.commands[attr]({ [attr]: value })
      this.$refs[attr] && this.$refs[attr].focus && this.$refs[attr].focus()
    },
    openGoogleFont() {
      const win = window.open('https://fonts.google.com/', '_blank')
      win.focus()
    }
  }
}
</script>

<style scoped lang="scss"></style>
