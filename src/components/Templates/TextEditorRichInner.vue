<template>
  <div
    v-if="editor"
    class="editor"
  >
    <template v-if="isDraftMode && editing">
      <portal
        v-if="canEditStyle"
        to="PanelStyles"
      >
        <text-editor-rich-style
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
              <div
                :class="{ absolute: headingHover }"
                class="heading flex"
                @mouseenter="headingHover = true"
                @mouseleave="headingHover = false"
              >
                <button
                  :class="{
                    'is-active': isActive.paragraph()
                  }"
                  class="menububble__button"
                  @click="commands.paragraph"
                >
                  <img
                    svg-inline
                    src="icons/paragraph.svg"
                  >
                </button>

                <button
                  v-for="level in [1, 2, 3, 4, 5, 6]"
                  :key="level"
                  :class="{
                    'is-active': isActive.heading({ level }),
                    hidden: !headingHover && !isActive.heading({ level })
                  }"
                  class="menububble__button"
                  @click="commands.heading({ level })"
                >
                  H{{ level }}
                </button>
              </div>

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
                :class="{
                  'is-active': getMarkAttrs('textAlign').textAlign === 'left'
                }"
                class="menububble__button"
                @click="setAttribute('textAlign', 'left')"
              >
                <i class="el-icon-s-fold" />
              </button>
              <button
                :class="{
                  'is-active': getMarkAttrs('textAlign').textAlign === 'center'
                }"
                class="menububble__button"
                @click="setAttribute('textAlign', 'center')"
              >
                <i class="el-icon-s-unfold" />
              </button>
              <button
                :class="{
                  'is-active': getMarkAttrs('textAlign').textAlign === 'right'
                }"
                class="menububble__button"
                @click="setAttribute('textAlign', 'right')"
              >
                <i class="el-icon-s-unfold" />
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
            :class="{ 'is-active': isActive.blockquote() }"
            class="menububble__button"
            @click="commands.blockquote"
          >
            <img
              svg-inline
              src="icons/quote.svg"
            >
          </button>

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
        </div>
      </editor-floating-menu>
    </template>

    <editor-content :editor="editor" />
  </div>
  <div
    v-else
    class="editor ProseMirror"
    v-html="value"
  />
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
import { mapState, mapMutations, mapGetters } from 'vuex'
import { arrayUniq } from '../../utils/array'
import { Popover } from 'element-ui'
import WebFont from 'webfontloader'
import ColorPicker from '@/vendor/element-ui/color-picker'
import { TEXT_EDITOR } from '@/const'

export default {
  name: 'TextEditorRichInner',
  components: {
    ColorPicker,
    ElPopover: Popover,
    EditorContent,
    EditorMenuBubble,
    EditorFloatingMenu,
    TextEditorRichStyle: () =>
      import('@/components/Setup/EditorStyle/TextEditorRichStyle')
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
          <p>Try to <em>enter</em> a new line will have more magic.</p>
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
      linkMenuIsActive: false,
      headingHover: false
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    ...mapGetters('app', ['selectedComponentNodes']),
    canEditStyle() {
      return this.selectedComponentNodes.every(node =>
        [TEXT_EDITOR, 'flex-button'].includes(node.tag)
      )
    },
    selected() {
      return this.selectedComponentIds.includes(this.id)
    }
  },
  watch: {
    editing(value) {
      if (value) {
        this.editor = new Editor({
          editable: this.isDraftMode,
          extensions,
          content: this.value,
          onBlur: () => {
            if (this.isExample || !this.id) {
              return
            }

            const html = this.editor.getHTML()

            const fonts = this.findFontNames(html)
            const records = [
              {
                path: `${this.id}.value`,
                value: html
              }
            ]

            if (fonts && fonts.length) {
              records.push({
                path: `${this.id}.fonts`,
                value: fonts
              })
            }

            this.RECORD(records)
          }
        })
      }
      else if (this.editor) {
        this.editor.destroy()
        this.editor = null
      }
    }
  },
  created() {
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
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy()
    }
  },
  methods: {
    ...mapMutations('node', ['RECORD']),
    findFontNames(string) {
      if (typeof string === 'object') {
        string = JSON.stringify(string)
      }

      const match = string.match(/fontFamily:([\w|\s]*)/g)
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
.heading {
  background: white;
  z-index: 10;
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
  padding: 0;
}
</style>
