<template>
  <text-editor-rich-inner
    v-if="isParagraph"
    :id="id"
    :editing="editing"
    :value="innerValue"
  />
  <text-editor-simple-inner
    v-else
    :id="id"
    :editing="editing"
    :value="innerValue"
  />
</template>

<script>
import nodeMixin from './mixins/node'
import TextEditorRichInner from './TextEditorRichInner'
import TextEditorSimpleInner from './TextEditorSimpleInner'
import { isParagraph } from '@/utils/node'

export default {
  name: 'TextEditor',
  components: {
    TextEditorRichInner,
    TextEditorSimpleInner
  },
  mixins: [nodeMixin],
  props: {
    editing: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isParagraph() {
      return isParagraph(this.node)
    }
  }
}
</script>
