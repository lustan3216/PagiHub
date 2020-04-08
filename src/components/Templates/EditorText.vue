<template>
  <div
    v-if="lazyLoaded"
    class="h-100"
  >
    <div :id="`toolbar${_uid}`">
      <span
        v-show="toggledBar"
        class="ql-formats m-l-12"
      >
        <select
          v-if="only.includes('header')"
          class="ql-header"
          style="width: 110px;"
        >
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
          <option selected>Normal</option>
        </select>

        <button
          v-if="only.includes('link')"
          class="ql-link"
        />

        <button
          v-if="only.includes('bold')"
          class="ql-bold"
        />

        <button
          v-if="only.includes('italic')"
          class="ql-italic"
        />

        <color-picker
          v-if="only.includes('fontColor')"
          v-model="fontColor"
        >
          <font-icon />
        </color-picker>

        <color-picker
          v-if="only.includes('backgroundColor')"
          v-model="backgroundColor"
        >
          <background-icon />
        </color-picker>

        <button
          v-if="only.includes('ordered')"
          class="ql-list"
          value="ordered"
        />

        <button
          v-if="only.includes('bullet')"
          class="ql-list"
          value="bullet"
        />

        <select
          v-if="only.includes('align')"
          class="ql-align"
        >
          <option selected />
          <option value="center" />
          <option value="right" />
          <option value="justify" />
        </select>
      </span>

      <span
        v-show="!toggledBar"
        class="ql-formats m-l-12"
      >
        <select
          v-if="only.includes('font')"
          class="ql-font"
          style="width: 110px;"
        >
          <option selected>Sans Serif</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
        </select>

        <button
          v-if="only.includes('underline')"
          class="ql-underline"
        />

        <button
          v-if="only.includes('strike')"
          class="ql-strike"
        />

        <button
          v-if="only.includes('script')"
          class="ql-script"
          value="sub"
        />

        <button
          v-if="only.includes('script')"
          class="ql-script"
          value="super"
        />

        <button
          v-if="only.includes('indent')"
          class="ql-indent"
          value="-1"
        />

        <button
          v-if="only.includes('indent')"
          class="ql-indent"
          value="+1"
        />

        <button
          v-if="only.includes('blockquote')"
          class="ql-blockquote"
        />

        <button
          v-if="only.includes('codeBlock')"
          class="ql-code-block"
        />
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
    <quill-editor
      ref="editor"
      v-model="innerContent"
      :style="innerStyles"
      :options="editorOption"
      class="h-100"
    />
  </div>
  <div
    v-else
    class="h-100 quill-editor"
    @mouseover="lazyLoaded = true"
  >
    <div class="ql-container">
      <div
        class="ql-editor"
        v-html="innerContent"
      />
    </div>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
import nodeMixin from '../../mixins/node'
import { mapMutations } from 'vuex'
import ColorPicker from '../Components/ColorPicker'
import FontIcon from 'quill/assets/icons/color.svg'
import BackgroundIcon from 'quill/assets/icons/background.svg'

export default {
  name: 'EditorText',
  components: {
    ColorPicker,
    QuillEditor: quillEditor,
    FontIcon,
    BackgroundIcon
  },
  mixins: [nodeMixin],
  props: {
    value: {
      type: String,
      default: 'I am Editor'
    },
    only: {
      type: Array,
      default() {
        return [
          'header',
          'link',
          'bold',
          'italic',
          'fontColor',
          'backgroundColor',
          'ordered',
          'bullet',
          'align',
          'font',
          'underline',
          'strike',
          'script',
          'script',
          'indent',
          'indent',
          'blockquote',
          'codeBlock'
        ]
      }
    }
  },
  data() {
    return {
      quill: null,
      lazyLoaded: false,
      fontColor: 'transparent',
      backgroundColor: 'transparent',
      toggledBar: true,
      editorOption: {
        theme: 'bubble',
        modules: {
          toolbar: `#toolbar${this._uid}`
        }
      }
    }
  },
  computed: {
    innerContent: {
      get() {
        const vm = !this.isExample && this.node

        if (vm && vm.value) {
          return vm.value
        } else {
          return this.value
        }
      },
      set(value) {
        if (this.isExample) return
        if (this.id) {
          // 當在別的組建被使用時，不會有ID，所以不用update vuex
          this.RECORD([
            {
              path: `${this.id}.value`,
              value
            }
          ])
        } else {
          this.$emit('input', value)
        }
      }
    }
  },
  watch: {
    fontColor(value) {
      this.quill.format('color', value)
    },
    backgroundColor(value) {
      this.quill.format('background', value)
    },
    lazyLoaded() {
      this.$nextTick(() => {
        this.quill = this.$refs.editor.quill
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
      })
    }
  },
  methods: {
    ...mapMutations('draft', ['RECORD'])
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
.quillWrapper .ql-editor ul[data-checked='false'] > li::before,
.quillWrapper .ql-editor ul[data-checked='true'] > li::before {
  font-size: 1.35em;
  vertical-align: baseline;
  bottom: -0.065em;
  font-weight: 900;
  color: #222;
}
</style>
