<template>
  <div
    v-if="editor"
    class="editor"
  >
    <template v-if="isDraftMode && editing">
      <portal to="FontStyles">
        <text-editor-style
          :id="id"
          :editor="editor"
        />
      </portal>

      <portal to="App">
        <editor-menu-bubble
          v-slot="{ commands, isActive, getMarkAttrs, menu }"
          :editor="editor"
          keep-in-bounds
          @hide="hideLinkMenu"
        >
          <div
            id="menu-bubble"
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

              <button
                :class="{ 'is-active': isActive.bold() }"
                class="menububble__button"
                @click="commands.bold"
              >
                <img
                  svg-inline
                  src="icons/bold.svg"
                >
              </button>

              <button
                :class="{ 'is-active': isActive.italic() }"
                class="menububble__button"
                @click="commands.italic"
              >
                <img
                  svg-inline
                  src="icons/italic.svg"
                >
              </button>

              <button
                :class="{ 'is-active': isActive.code() }"
                class="menububble__button"
                @click="commands.code"
              >
                <img
                  svg-inline
                  src="icons/code.svg"
                >
              </button>

              <button
                :class="{ 'is-active': isActive.strike() }"
                class="menububble__button"
                @click="commands.strike"
              >
                <img
                  svg-inline
                  src="icons/strike.svg"
                >
              </button>

              <button
                :class="{ 'is-active': isActive.underline() }"
                class="menububble__button"
                @click="commands.underline"
              >
                <img
                  svg-inline
                  src="icons/underline.svg"
                >
              </button>

              <button
                :class="{ 'is-active': isActive.paragraph() }"
                class="menububble__button"
                @click="commands.paragraph"
              >
                <img
                  svg-inline
                  src="icons/paragraph.svg"
                >
              </button>

              <button
                :class="{ 'is-active': isActive.blockquote() }"
                class="menububble__button"
                @click="commands.blockquote"
              >
                <img
                  svg-inline
                  src="icons/quote.svg"
                >
              </button>

              <button class="menububble__button">
                <span
                  :style="{
                    color: getMarkAttrs('color').color
                  }"
                  style="margin-left: 2px;margin-top: -2px;font-size: 16px;"
                >A</span>
                <color-picker
                  :value="getMarkAttrs('color').color"
                  show-alpha
                  @change="setAttribute('color', $event)"
                />
              </button>

              <button class="menububble__button">
                <i
                  :style="{
                    color: getMarkAttrs('backgroundColor').backgroundColor
                  }"
                  style="font-size: 14px;"
                  class="el-icon-s-opportunity"
                />
                <color-picker
                  :value="getMarkAttrs('backgroundColor').backgroundColor"
                  show-alpha
                  @change="setAttribute('backgroundColor', $event)"
                />
              </button>
            </template>
          </div>
        </editor-menu-bubble>
      </portal>

      <editor-floating-menu
        v-slot="{ commands, isActive, menu }"
        :editor="editor"
      >
        <div
          :class="{ 'is-active': menu.isActive }"
          :style="`top: ${menu.top}px`"
          class="editor__floating-menu"
        >
          <button
            :class="{ 'is-active': isActive.bullet_list() }"
            class="menububble__button"
            @click="commands.bullet_list"
          >
            <img
              svg-inline
              src="icons/ul.svg"
            >
          </button>

          <button
            :class="{ 'is-active': isActive.ordered_list() }"
            class="menububble__button"
            @click="commands.ordered_list"
          >
            <img
              svg-inline
              src="icons/ol.svg"
            >
          </button>

          <button
            :class="{ 'is-active': isActive.code_block() }"
            class="menububble__button"
            @click="commands.code_block"
          >
            <img
              svg-inline
              src="icons/code.svg"
            >
          </button>

          <button
            :class="{ 'is-active': isActive.todo_list() }"
            class="menububble__button"
            @click="commands.todo_list"
          >
            <img
              svg-inline
              src="icons/checklist.svg"
            >
          </button>

          <button
            :class="{ 'is-active': isActive.heading({ level: 1 }) }"
            class="menububble__button"
            @click="commands.heading({ level: 1 })"
          >
            H1
          </button>

          <button
            :class="{ 'is-active': isActive.heading({ level: 2 }) }"
            class="menububble__button"
            @click="commands.heading({ level: 2 })"
          >
            H2
          </button>

          <button
            :class="{ 'is-active': isActive.heading({ level: 3 }) }"
            class="menububble__button"
            @click="commands.heading({ level: 3 })"
          >
            H3
          </button>

          <button
            :class="{ 'is-active': isActive.heading({ level: 4 }) }"
            class="menububble__button"
            @click="commands.heading({ level: 4 })"
          >
            H4
          </button>

          <button
            :class="{ 'is-active': isActive.heading({ level: 5 }) }"
            class="menububble__button"
            @click="commands.heading({ level: 5 })"
          >
            H5
          </button>

          <button
            :class="{ 'is-active': isActive.heading({ level: 6 }) }"
            class="menububble__button"
            @click="commands.heading({ level: 6 })"
          >
            H6
          </button>
        </div>
      </editor-floating-menu>
    </template>

    <editor-content :editor="editor" />
  </div>
</template>
<script>
import {
  Editor,
  EditorContent,
  EditorMenuBubble,
  EditorFloatingMenu
} from 'tiptap'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  History,
  Strike,
  Underline
} from 'tiptap-extensions'
import {
  Color,
  BackgroundColor,
  FontFamily,
  FontSize,
  LetterSpacing,
  LineHeight,
  TextAlign
} from '../../vendor/tiptap'
import { mapState, mapMutations } from 'vuex'
import { arrayUniq } from '../../utils/array'
import WebFont from 'webfontloader'
import ColorPicker from '@/components/Components/ColorPicker'

export default {
  name: 'TextEditorInner',
  components: {
    ColorPicker,
    EditorContent,
    EditorMenuBubble,
    EditorFloatingMenu,
    TextEditorStyle: () =>
      import('@/components/Setup/EditorStyle/TextEditorStyle')
  },
  inject: {
    isExample: { default: false }
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
          <p>this is a very <em>basic</em> example.</p>
          <pre><code>body { display: none; }</code></pre>
          <ul>
            <li>A regular list</li>
            <li>With regular items</li>
          </ul>
          <blockquote>
            It's amazing 👏<br />– mom
          </blockquote>
        `
    },
    editing: {
      type: Boolean,
      default: false
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
    const families = this.findFontNames(this.value)

    if (families.length) {
      WebFont.load({
        classes: false,
        events: false,
        google: {
          families
        }
      })
    }

    this.editor = new Editor({
      editable: this.isDraftMode,
      extensions,
      content: this.value,
      onBlur: () => {
        if (self.isExample || !self.id) {
          return
        }

        const json = self.editor.getJSON()
        const fonts = this.findFontNames(json)
        const records = [
          {
            path: `${self.id}.value`,
            value: json
          }
        ]

        if (fonts && fonts.length) {
          records.push({
            path: `${self.id}.fonts`,
            value: fonts
          })
        }

        self.RECORD(records)
      }
    })
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    ...mapMutations('node', ['RECORD']),
    findFontNames(string) {
      if (typeof string === 'object') {
        string = JSON.stringify(string)
      }

      const match = string.match(/fontFamily":"([\w|\s]*)/g)
      if (match) {
        const fonts = match.map(x => x.replace(/fontFamily|[^\s\w]/g, ''))
        return arrayUniq(fonts)
      }
      return []
    },
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
    setLinkUrl(command, href) {
      command({ href })
      this.hideLinkMenu()
      this.editor.focus()
    },
    setAttribute(attr, value) {
      this.editor.commands[attr]({ [attr]: value })
    }
  }
}

const extensions = [
  new Blockquote(),
  new BulletList(),
  new CodeBlock(),
  new HardBreak(),
  new Heading({ levels: [1, 2, 3, 4, 5, 6] }),
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
  new LineHeight(),
  new TextAlign()
]
</script>

<style lang="scss" scoped>
$color-white: #ffffff;
$color-grey: #b2b2b2;

::v-deep .svg-inline {
  width: 14px;
  fill: $color-black;
  padding-left: 0;
}
.menububble {
  transform: translateX(-50%);
  border: 1px solid $color-grey;
  padding: 0.3rem;
  margin-bottom: 0.5rem;
}

.editor__floating-menu {
  margin-left: 15px;
}

.el-color-picker {
  margin-left: -18px;
  margin-top: -7px;
  opacity: 0;
  overflow: hidden;
}

::v-deep.menububble,
::v-deep.editor__floating-menu {
  font-size: 12px;
  position: absolute;
  display: flex;
  z-index: 900;
  background: white;
  border-radius: 5px;
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s;

  &.is-active {
    opacity: 1;
    visibility: visible;
  }

  &__button {
    display: inline-flex;
    background: transparent;
    border: 0;
    color: $color-black;
    font-weight: bold;
    padding: 0.2rem 0.5rem;
    margin-right: 0.2rem;
    border-radius: 3px;
    cursor: pointer;
    width: 30px;
    height: 20px;
    overflow: hidden;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      background-color: rgba($color-grey, 0.4);
    }

    &.is-active {
      background-color: rgba($color-grey, 0.7);
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
    color: $color-black;
  }
}

.editor {
  position: relative;
  overflow: hidden;
  padding: 0 10px;
}

::v-deep .ProseMirror {
  &__content {
    word-wrap: break-word;
  }

  * {
    caret-color: currentColor;
  }

  pre {
    padding: 10px;
    border-radius: 5px;
    background: $color-black;
    color: $color-white;
    font-size: 14px;
    overflow-x: auto;

    code {
      display: block;
    }
  }

  p code {
    display: inline-block;
    padding: 10px;
    border-radius: 5px;
    font-size: 14px;
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
