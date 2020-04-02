<template>
  <el-button class="wh-100 m-0 button">
    <editor-text
      v-if="isDraftMode"
      :id="id"
      :only="['bold', 'italic', 'fontColor', 'font', 'underline', 'strike']"
      v-model="innerValue"
    />
    <div v-else v-html="innerValue" />
  </el-button>
</template>

<script>
import { mapMutations } from 'vuex'
import commonMixin from '../../mixins/common'
import EditorText from './EditorText'
import store from '../../store'

export default {
  name: 'FlexButton',
  components: {
    EditorText
  },
  mixins: [commonMixin],
  props: {
    defaultText: {
      type: String,
      default: 'Edit me'
    }
  },
  data() {
    const node = store.state.nodes.currentNodesMap[this.id]
    return {
      innerValue: (!this.isDemonstrated && node && node.value) || this.defaultText
    }
  },
  watch: {
    innerValue(value) {
      this.ASSIGN({
        id: this.id,
        value
      })
    }
  },
  methods: {
    ...mapMutations('nodes', ['ASSIGN'])
  }
}
</script>

<style lang="scss" scoped>
.edit-area {
  height: 100%;
}
::v-deep.button {
  & .ql-editor,
  & .ql-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ql-editor {
    padding: 0;
    min-height: inherit;
  }
}
</style>
