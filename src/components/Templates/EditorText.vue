<template>
  <div>
    <portal :to="`GridItemChild${id}`">
      <EditorTextTutorial class="link" />
    </portal>
    <editor-content :editor="editor" />
  </div>
</template>
<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History
} from 'tiptap-extensions'

import nodeMixin from './mixins/node'
import EditorTextTutorial from '../TemplateUtils/EditorTextTutorial'

export default {
  components: {
    EditorContent,
    EditorMenuBar,
    EditorTextTutorial
  },
  mixins: [nodeMixin],
  data() {
    return {
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3, 4, 5, 6] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History()
        ],
        content: `
          <h2>
            Hi there,
          </h2>
          <p>
            this is a very <em>basic</em> example of tiptap.
          </p>
          <pre><code>body { display: none; }</code></pre>
          <ul>
            <li>
              A regular list
            </li>
            <li>
              With regular items
            </li>
          </ul>
          <blockquote>
            It's amazing 👏
            <br />
            – mom
          </blockquote>
        `
      })
    }
  },
  computed: {
    innerContent: {
      get() {
        const vm = !this.isExample && this.node

        if (vm && vm.value) {
          return vm.value
        } else {
          return 'Edit me'
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
  beforeDestroy() {
    this.editor.destroy()
  }
}
</script>

<style lang="scss" scoped>
.link {
  right: 5px;
  top: 5px;
  position: absolute;
}
</style>
