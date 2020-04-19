<template>
  <editor-text-inner
    :id="id"
    :value="innerValue"
  />
</template>

<script>
import nodeMixin from './mixins/node'
import EditorTextInner from './EditorTextInner'
export default {
  components: {
    EditorTextInner
  },
  mixins: [nodeMixin]
}
</script>
