<template>
  <div
    v-if="editor"
    class="over-hidden"
  >
    <template v-if="selected && isDraftMode">
      <portal
        v-if="isDraftMode"
        to="FontStyles"
      >
        <text-editor-style :editor="editor" />
      </portal>

      <editor-menu-bubble
        :editor="editor"
        class="menububble"
        @hide="hideLinkMenu"
      >
        <div
          slot-scope="{ commands, isActive, getMarkAttrs, menu }"
          :class="{ 'is-active': menu.isActive }"
          :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
          class="menububble"
        >
          <form
            v-if="linkMenuIsActive"
            class="menububble__form"
            @submit.prevent="setLinkUrl(commands.link, linkUrl)"
          >
            <input
              ref="linkInput"
              v-model="linkUrl"
              class="menububble__input"
              type="text"
              placeholder="https://"
              @keydown.esc="hideLinkMenu"
            >
            <button
              class="menububble__button"
              type="button"
              @click="setLinkUrl(commands.link, null)"
            >
              <img
                svg-inline
                src="icons/remove.svg"
              >
            </button>
          </form>

          <template v-else>
            <button
              class="menububble__button"
              @click="showLinkMenu(getMarkAttrs('link'))"
            >
              <img
                svg-inline
                src="icons/link.svg"
              >
            </button>
          </template>
        </div>
      </editor-menu-bubble>
    </template>

    <editor-content :editor="editor" />
  </div>
</template>
<script>
import { Editor, EditorContent, EditorMenuBubble } from 'tiptap'

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
import {
  Color,
  BackgroundColor,
  FontFamily,
  FontSize,
  LetterSpacing,
  LineHeight
} from '../../vendor/tiptap'
import { mapState, mapMutations } from 'vuex'

export default {
  components: {
    EditorContent,
    EditorMenuBubble,
    TextEditorStyle: () =>
      import('@/components/Setup/EditorStyle/TextEditorStyle')
  },
  props: {
    id: {
      type: String,
      required: true
    },
    // eslint-disable-next-line
    value: {
      default: `
          <h2>Hi there,</h2>
          <p>this is a very <em>basic</em> example of tiptap.</p>
          <pre><code>body { display: none; }</code></pre>
          <ul>
            <li>A regular list</li>
            <li>With regular items</li>
          </ul>
          <blockquote>
            It's amazing 👏<br />– mom
          </blockquote>
        `
    }
  },
  data() {
    return {
      editor: null,
      linkUrl: null,
      linkMenuIsActive: false
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    selected() {
      return this.selectedComponentIds.includes(this.id)
    }
  },
  created() {
    const self = this
    this.editor = new Editor({
      editable: this.isDraftMode,
      extensions,
      content: this.value,
      onBlur: () => {
        if (self.isExample) return
        if (self.id) {
          self.RECORD([
            {
              path: `${self.id}.value`,
              value: self.editor.getJSON()
            }
          ])
        }
      }
    })
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    ...mapMutations('component', ['RECORD']),
    showLinkMenu(attrs) {
      this.linkUrl = attrs.href
      this.linkMenuIsActive = true
      this.$nextTick(() => {
        this.$refs.linkInput.focus()
      })
    },
    hideLinkMenu() {
      this.linkUrl = null
      this.linkMenuIsActive = false
    },
    setLinkUrl(command, url) {
      command({ href: url })
      this.hideLinkMenu()
      this.editor.focus()
    }
  }
}

const extensions = [
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
  new History(),
  new Color(),
  new BackgroundColor(),
  new FontFamily(),
  new FontSize(),
  new LetterSpacing(),
  new LineHeight()
]
</script>

<style lang="scss" scoped>
$color-black: #000000;
$color-white: #ffffff;
$color-grey: #dddddd;

.menububble {
  font-size: 13px;
  position: absolute;
  display: flex;
  z-index: 20;
  background: $color-black;
  border-radius: 5px;
  padding: 0.3rem;
  margin-bottom: 0.5rem;
  transform: translateX(-50%);
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s, visibility 0.2s;

  &.is-active {
    opacity: 1;
    visibility: visible;
  }

  &__button {
    display: inline-flex;
    background: transparent;
    border: 0;
    color: $color-white;
    padding: 0.2rem 0.5rem;
    margin-right: 0.2rem;
    border-radius: 3px;
    cursor: pointer;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      background-color: rgba($color-white, 0.1);
    }

    &.is-active {
      background-color: rgba($color-white, 0.2);
    }
  }

  &__form {
    display: flex;
    align-items: center;
  }

  &__input,
  svg {
    font: inherit;
    border: none;
    background: transparent;
    color: $color-white;
  }
}
.menubar {
  margin-bottom: 1rem;
  transition: visibility 0.2s 0.4s, opacity 0.2s 0.4s;

  &.is-hidden {
    visibility: hidden;
    opacity: 0;
  }

  &.is-focused {
    visibility: visible;
    opacity: 1;
    transition: visibility 0.2s, opacity 0.2s;
  }

  &__button {
    font-weight: bold;
    display: inline-flex;
    background: transparent;
    border: 0;
    color: $color-black;
    padding: 3px;
    margin-right: 5px;
    border-radius: 3px;
    cursor: pointer;

    &:hover {
      background-color: rgba($color-black, 0.05);
    }

    &.is-active {
      background-color: rgba($color-black, 0.1);
    }
  }
}

::v-deep .ProseMirror {
  position: relative;

  &__content {
    word-wrap: break-word;
  }

  * {
    caret-color: currentColor;
  }

  pre {
    padding: 0.7rem 1rem;
    border-radius: 5px;
    background: $color-black;
    color: $color-white;
    font-size: 0.8rem;
    overflow-x: auto;

    code {
      display: block;
    }
  }

  p code {
    display: inline-block;
    padding: 0 0.4rem;
    border-radius: 5px;
    font-size: 0.8rem;
    font-weight: bold;
    background: rgba($color-black, 0.1);
    color: rgba($color-black, 0.8);
  }

  ul,
  ol {
    padding-left: 1rem;
  }

  li > p,
  li > ol,
  li > ul {
    margin: 0;
  }

  a {
    color: inherit;
  }

  blockquote {
    border-left: 3px solid rgba($color-black, 0.1);
    color: rgba($color-black, 0.8);
    padding-left: 0.8rem;
    font-style: italic;

    p {
      margin: 0;
    }
  }

  img {
    max-width: 100%;
    border-radius: 3px;
  }

  table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;

    td,
    th {
      min-width: 1em;
      border: 2px solid $color-grey;
      padding: 3px 5px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;
      > * {
        margin-bottom: 0;
      }
    }

    th {
      font-weight: bold;
      text-align: left;
    }

    .selectedCell:after {
      z-index: 2;
      position: absolute;
      content: '';
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(200, 200, 255, 0.4);
      pointer-events: none;
    }

    .column-resize-handle {
      position: absolute;
      right: -2px;
      top: 0;
      bottom: 0;
      width: 4px;
      z-index: 20;
      background-color: #adf;
      pointer-events: none;
    }
  }

  .tableWrapper {
    margin: 1em 0;
    overflow-x: auto;
  }

  &.resize-cursor {
    cursor: ew-resize;
    cursor: col-resize;
  }

  ul[data-type='todo_list'] {
    padding-left: 0;
  }
  li[data-type='todo_item'] {
    display: flex;
    align-items: center;
    flex-direction: row;
  }
  .todo-checkbox {
    border: 2px solid $color-black;
    height: 0.9em;
    width: 0.9em;
    box-sizing: border-box;
    margin-right: 10px;
    margin-top: 0.3rem;
    user-select: none;
    -webkit-user-select: none;
    cursor: pointer;
    border-radius: 0.2em;
    background-color: transparent;
    transition: 0.4s background;
  }
  .todo-content {
    flex: 1;
    p {
      margin-top: 0;
    }
    > p:last-of-type {
      margin-bottom: 0;
    }
    > ul[data-type='todo_list'] {
      margin: 0.5rem 0;
    }
  }
  li[data-done='true'] {
    > .todo-content {
      > p {
        text-decoration: line-through;
      }
    }
    > .todo-checkbox {
      background-color: $color-black;
    }
  }
  li[data-done='false'] {
    text-decoration: none;
  }
}
</style>
