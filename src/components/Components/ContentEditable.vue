<template>
  <component
    ref="element"
    :is="tag"
    :contenteditable="contentEditable"
    @input="update"
    @blur="update"
    @paste="onPaste"
    @keypress="onKeypress"
    @select="fwdEv"
    @cut="fwdEv"
    @copy="fwdEv"
  />
</template>

<script>
function replaceAll(str, search, replacement) {
  return str.split(search).join(replacement)
}

export default {
  name: 'ContentEditable',
  props: {
    tag: {
      type: String,
      default: ''
    },
    contentEditable: {
      type: Boolean,
      default: true
    },
    value: {
      type: String,
      default: ''
    },
    noHTML: {
      type: Boolean,
      default: false
    },
    noNewLine: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    tag() {
      this.$nextTick(() => {
        this.updateContent(this.value)
      })
    },
    value(newVal) {
      if (newVal !== this.currentContent()) {
        this.updateContent(newVal)
      }
    }
  },
  mounted() {
    this.updateContent(this.value)
  },
  methods: {
    currentContent() {
      return this.noHTML
        ? this.$refs.element.innerText
        : this.$refs.element.innerHTML
    },
    updateContent(newContent) {
      if (this.noHTML) {
        this.$refs.element.innerText = newContent
      }
      else {
        this.$refs.element.innerHTML = newContent
      }
    },
    update(event) {
      this.$emit('input', this.currentContent())
    },
    onPaste(event) {
      event.preventDefault()
      let text = (event.originalEvent || event).clipboardData.getData(
        'text/plain'
      )
      if (this.noNewLine) {
        text = replaceAll(text, '\r\n', ' ')
        text = replaceAll(text, '\n', ' ')
        text = replaceAll(text, '\r', ' ')
      }
      window.document.execCommand('insertText', false, text)
      this.fwdEv(event)
    },
    onKeypress(event) {
      if (event.key === 'Enter' && this.noNewLine) {
        event.preventDefault()
        this.$emit('returned', this.currentContent())
      }
      this.fwdEv(event)
    },
    fwdEv(event) {
      this.$emit(event.type, event)
    }
  }
}
</script>

<style scoped></style>
