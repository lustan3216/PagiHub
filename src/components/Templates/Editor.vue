<template>
  <div
    class="h-100"
    @click="noClick = false"
    @mouseleave="noClick = true"
    @mouseenter="mouseenter"
  >
    <div :id="`toolbar${_uid}`" style="width: 426px;">
      <span v-show="toggledBar" class="ql-formats m-l-12">
        <select class="ql-header" style="width: 110px;">
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
          <option selected>Normal</option>
        </select>
        <button class="ql-link" />
        <button class="ql-bold" />
        <button class="ql-italic" />
        <color-picker v-model="fontColor">
          <font-icon />
        </color-picker>
        <color-picker v-model="backgroundColor">
          <background-icon />
        </color-picker>
        <button class="ql-list" value="ordered" />
        <button class="ql-list" value="bullet" />
        <select class="ql-align">
          <option selected />
          <option value="center" />
          <option value="right" />
          <option value="justify" />
        </select>
      </span>
      <span v-show="!toggledBar" class="ql-formats m-l-12">
        <select class="ql-font" style="width: 110px;">
          <option selected>Sans Serif</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
        </select>
        <button class="ql-underline" />
        <button class="ql-strike" />
        <button class="ql-script" value="sub" />
        <button class="ql-script" value="super" />
        <button class="ql-indent" value="-1" />
        <button class="ql-indent" value="+1" />
        <button class="ql-blockquote" />
        <button class="ql-code-block" />
      </span>

      <span class="ql-formats">
        <button class="ql-clean" />
        <button
          :class="{
            'el-icon-caret-right': toggledBar,
            'el-icon-caret-left': !toggledBar
          }"
          @click="toggledBar = !toggledBar"
        />
      </span>
    </div>
    <vue-editor
      ref="editor"
      v-model="content"
      :class="['no-drag', 'h-100', noClick ? 'no-click' : '']"
      :style="innerStyles"
      :editor-options="editorOption"
    />
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.snow.css'
import commonMixin from '../../mixins/common'
import { mapState, mapMutations } from 'vuex'
import { VueEditor } from 'vue2-editor'
import ColorPicker from './Components/ColorPicker'
import FontIcon from 'quill/assets/icons/color.svg'
import BackgroundIcon from 'quill/assets/icons/background.svg'

export default {
  name: 'Editor',
  components: {
    ColorPicker,
    VueEditor,
    FontIcon,
    BackgroundIcon
  },
  mixins: [commonMixin],
  data() {
    return {
      fontColor: 'transparent',
      backgroundColor: 'transparent',
      toggledBar: true,
      noClick: true,
      editorOption: {
        theme: 'bubble',
        modules: {
          toolbar: `#toolbar${this._uid}`
        }
      }
    }
  },
  computed: {
    ...mapState('nodes', ['currentNodesMap']),
    quill() {
      return this.$refs.editor.quill
    },
    content: {
      get() {
        const vm = this.currentNodesMap[this.id] && this.isEditable

        if (vm && vm.setting && vm.setting.content) {
          return vm.setting.content
        } else {
          return '<h2>I am Editor</h2>'
        }
      },
      set(content) {
        this.isEditable &&
          this.ASSIGN({
            id: this.id,
            setting: { content }
          })
      }
    }
  },
  watch: {
    fontColor(value) {
      this.quill.format('color', value)
    },
    backgroundColor(value) {
      this.quill.format('background', value)
    }
  },
  mounted() {
    this.quill.on('selection-change', (eventName, range) => {
      if (eventName === 'selection-change') {
        if (range) {
          const style = this.quill.getFormat(range.index, range.length)
          this.fontColor = style.color
          this.backgroundColor = style.background
          this.quill.off('selection-change')
        }
      }
    })
  },
  methods: {
    ...mapMutations('nodes', ['ASSIGN']),
    mouseenter() {
      this.noClick = this.$el
        .querySelector('.ql-tooltip')
        .classList.contains('ql-hidden')
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .ql-editor {
    overflow: visible;
  }
  .ql-bubble .ql-tooltip {
    border-radius: 5px;
    transition: top 0.6s, left 0.6s;
  }
  .ql-container.ql-bubble:not(.ql-disabled) a::before {
    border-radius: 5px;
  }
}
[class^='el-icon'] {
  color: #cccccc;
}
.m-l-12 {
  margin-left: 12px !important;
}
</style>
