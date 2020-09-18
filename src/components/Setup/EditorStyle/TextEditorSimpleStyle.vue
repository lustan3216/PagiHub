<template>
  <div>
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
          :value="fontFamily"
          @change="fontFamily = $event"
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
          :value="fontSize"
          @change="fontSize = $event"
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
          :value="letterSpacing"
          @change="letterSpacing = $event"
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
          :value="lineHeight"
          @change="lineHeight = $event"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { EditorMenuBubble } from 'tiptap'
import SelectUnit from '@/components/Components/SelectUnit'
import FontSelector from '@/components/Components/FontSelector'
import Tip from '@/components/Tutorial/Tip'
import { getValueByPath } from '@/utils/tool'
import { STYLES, HTML } from '@/const'
import { mapMutations } from 'vuex'
import { getNode } from '@/utils/node'

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
    }
  },
  computed: {
    node() {
      return getNode(this.id, this.isExample)
    },
    style() {
      return getValueByPath(this.node, [STYLES, HTML]) || {}
    },
    fontFamily: {
      get() {
        return this.style.fontFamily
      },
      set(value) {
        this.RECORD({
          path: `${this.id}.${STYLES}.${HTML}.fontFamily`,
          value
        })
      }
    },
    fontSize: {
      get() {
        return this.style.fontSize
      },
      set(value) {
        this.RECORD({
          path: `${this.id}.${STYLES}.${HTML}.fontSize`,
          value
        })
      }
    },
    letterSpacing: {
      get() {
        return this.style.letterSpacing
      },
      set(value) {
        this.RECORD({
          path: `${this.id}.${STYLES}.${HTML}.letterSpacing`,
          value
        })
      }
    },
    lineHeight: {
      get() {
        return this.style.lineHeight
      },
      set(value) {
        this.RECORD({
          path: `${this.id}.${STYLES}.${HTML}.lineHeight`,
          value
        })
      }
    }
  },
  methods: {
    ...mapMutations('node', ['RECORD']),
    openGoogleFont() {
      const win = window.open('https://fonts.google.com/', '_blank')
      win.focus()
    }
  }
}
</script>

<style scoped lang="scss"></style>
